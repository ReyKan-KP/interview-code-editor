import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

const execPromise = promisify(exec);

interface LanguageConfig {
  extension: string;
  command: string;
  prepare?: (filepath: string, className: string, code: string) => Promise<string>;
  checkCommand?: string; // To verify if the required tools are installed
  fallbackMessage?: string; // Message to show if tools aren't available
}

type SupportedLanguages = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'c';

// Define supported languages and their execution commands
const SUPPORTED_LANGUAGES: Record<SupportedLanguages, LanguageConfig> = {
  javascript: {
    extension: 'js',
    command: 'node {filename}',
  },
  typescript: {
    extension: 'ts',
    command: 'npx ts-node --compilerOptions \\"{\\"module\\":\\"commonjs\\"}\\" {filename}',
    checkCommand: 'npx ts-node --version',
    fallbackMessage: "TypeScript execution requires ts-node. The server doesn't have it properly configured.",
    prepare: async (filepath: string, className: string, code: string) => {
      // Add commonjs module format to TypeScript code to avoid ES module issues
      const updatedCode = code.replace(/export\s+\{.*?\};?/g, '');
      await fs.writeFile(filepath, updatedCode);
      return className;
    }
  },
  python: {
    extension: 'py',
    command: 'python {filename}',
    checkCommand: 'python --version',
    fallbackMessage: "Python execution requires Python to be installed on the server."
  },
  java: {
    extension: 'java',
    command: 'javac {filename} && java {classname}',
    checkCommand: 'javac -version',
    fallbackMessage: "Java execution requires the Java Development Kit (JDK) to be installed on the server.",
    // Special handling for Java (needs compilation)
    prepare: async (filepath: string, className: string, code: string) => {
      // Extract class name from code for Java
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      let extractedClassName = className;
      
      if (classMatch && classMatch[1]) {
        extractedClassName = classMatch[1];
        
        // If class name doesn't match filename, we need to rename the file
        if (extractedClassName !== className) {
          const dirName = path.dirname(filepath);
          const newFilePath = path.join(dirName, `${extractedClassName}.java`);
          
          // Create the file with matching class name
          await fs.writeFile(newFilePath, code);
          
          // Delete the original file to avoid compilation errors
          try {
            await fs.unlink(filepath);
          } catch (err) {
            // Ignore deletion errors
          }
          
          // Update filepath to the new file
          return extractedClassName;
        }
      }
      
      // If no public class found, wrap code in a default class matching the filename
      if (!classMatch) {
        const wrappedCode = `
public class ${className} {
  public static void main(String[] args) {
${code.split('\n').map(line => `    ${line}`).join('\n')}
  }
}`;
        await fs.writeFile(filepath, wrappedCode);
      } else {
        // Ensure the public class name matches the filename
        const updatedCode = code.replace(/public\s+class\s+(\w+)/, `public class ${className}`);
        await fs.writeFile(filepath, updatedCode);
      }
      
      return className;
    }
  },
  cpp: {
    extension: 'cpp',
    command: 'g++ {filename} -o {executable} && {executable}',
    checkCommand: 'g++ --version',
    fallbackMessage: "C++ execution requires g++ compiler to be installed on the server.",
    // Special handling for C++ (needs compilation)
    prepare: async (filepath: string, className: string) => {
      const dirName = path.dirname(filepath);
      const executable = path.join(dirName, className);
      return executable;
    }
  },
  c: {
    extension: 'c',
    command: 'gcc {filename} -o {executable} && {executable}',
    checkCommand: 'gcc --version',
    fallbackMessage: "C execution requires gcc compiler to be installed on the server.",
    // Special handling for C (needs compilation)
    prepare: async (filepath: string, className: string) => {
      const dirName = path.dirname(filepath);
      const executable = path.join(dirName, className);
      return executable;
    }
  }
};

// Helper function to check if a command is available
async function isCommandAvailable(command: string): Promise<boolean> {
  try {
    await execPromise(command);
    return true;
  } catch (error: any) {
    // On Windows, commands often return non-zero exit codes even when they exist
    // So we check if the error contains version information
    if (error.stderr && error.stderr.includes('version') || 
        error.stdout && error.stdout.includes('version')) {
      return true;
    }
    return false;
  }
}

export async function POST(req: Request) {
  let tempDir = '';
  
  try {
    // Parse request body
    const { code, language } = await req.json() as { 
      code: string; 
      language: string;
    };
    
    // Validate input
    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }
    
    if (!Object.keys(SUPPORTED_LANGUAGES).includes(language)) {
      return NextResponse.json({ error: `Language '${language}' is not supported` }, { status: 400 });
    }
    
    const lang = language as SupportedLanguages;
    
    // Check if required tools are installed
    if (SUPPORTED_LANGUAGES[lang].checkCommand) {
      const isAvailable = await isCommandAvailable(SUPPORTED_LANGUAGES[lang].checkCommand!);
      if (!isAvailable) {
        return NextResponse.json({ 
          error: SUPPORTED_LANGUAGES[lang].fallbackMessage || `Required tools for ${language} are not available on the server.` 
        }, { status: 500 });
      }
    }
    
    // Create temp directory and file
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-execution-'));
    const uniqueId = uuidv4().substring(0, 8);
    const className = `Program${uniqueId}`;
    const fileExtension = SUPPORTED_LANGUAGES[lang].extension;
    const fileName = `${className}.${fileExtension}`;
    const filePath = path.join(tempDir, fileName);
    
    // Write code to file
    await fs.writeFile(filePath, code);
    
    // Execute code based on language
    let command = SUPPORTED_LANGUAGES[lang].command;
    let classNameToUse = className;
    
    // Handle special cases (Java, C, C++, TypeScript)
    if (SUPPORTED_LANGUAGES[lang].prepare) {
      try {
        classNameToUse = await SUPPORTED_LANGUAGES[lang].prepare!(filePath, className, code);
        
        // For Java, we need the class name
        if (lang === 'java') {
          command = command.replace('{classname}', classNameToUse);
          command = command.replace('{filename}', `${classNameToUse}.java`);
        } 
        // For C/C++, we need the executable path
        else if (lang === 'c' || lang === 'cpp') {
          command = command.replace('{executable}', classNameToUse);
          command = command.replace('{filename}', fileName);
        }
        // For TypeScript, just replace the filename
        else {
          command = command.replace('{filename}', fileName);
        }
      } catch (prepareError: any) {
        return NextResponse.json({ 
          error: `Error preparing code: ${prepareError.message}` 
        }, { status: 500 });
      }
    } else {
      // For other languages, just replace the filename
      command = command.replace('{filename}', fileName);
    }
    
    // Set timeout to prevent long-running code
    const timeoutMs = 15000; // 15 seconds
    
    // Execute the code
    let output = '';
    let error = '';
    
    try {
      const { stdout, stderr } = await Promise.race([
        execPromise(command, { cwd: tempDir }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Execution timed out')), timeoutMs);
        })
      ]);
      
      output = stdout;
      error = stderr;
    } catch (execError: any) {
      // Handle execution errors more gracefully
      console.error('Execution error:', execError);
      
      if (execError.message.includes('timed out')) {
        error = 'Execution timed out (limit: 15 seconds).';
      } else if (execError.stdout || execError.stderr) {
        // Capture compiler/runtime output from the error object
        output = execError.stdout || '';
        error = execError.stderr || execError.message;
      } else {
        error = execError.message;
      }
    }
    
    // Provide more helpful information for specific errors
    if (lang === 'java' && error.includes('class') && error.includes('public')) {
      error += "\n\nNote: In Java, the file name must match the public class name. Our system tried to handle this but encountered an issue.";
    } else if (lang === 'typescript' && error.includes('Unexpected token \'export\'')) {
      error += "\n\nNote: Remove any 'export' statements from your TypeScript code when running in this environment.";
    } else if ((lang === 'c' || lang === 'cpp') && (error.includes('not recognized') || error.includes('not found'))) {
      error += `\n\nNote: ${lang === 'c' ? 'gcc' : 'g++'} compiler is not installed or not in the system PATH.`;
    }
    
    // Return response
    return NextResponse.json({
      output,
      error,
      language
    });
    
  } catch (error: unknown) {
    console.error('Error executing code:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during code execution';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    // Clean up temp files
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Error cleaning up temp files:', cleanupError);
      }
    }
  }
} 