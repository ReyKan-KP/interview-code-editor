import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
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

    // Define prompt templates based on language
    const getPrompt = (lang: string, code: string) => {
      const basePrompt = `You are a ${lang} code execution simulator. The following ${lang} code was provided:

\`\`\`${lang}
${code}
\`\`\`

Execute this code precisely and show ONLY the output that would be produced when running this code.
Do not include any explanations, comments, or preprocessing steps.
If there would be compilation or runtime errors, format them exactly as they would appear in a terminal.
If the code is syntactically correct and would run without producing output, respond with "No output".
`;
      
      // Add language-specific instructions
      if (lang === 'typescript') {
        return basePrompt + `
For TypeScript, assume that the code is transpiled to JavaScript with all type annotations removed.
Consider TypeScript compilation errors where appropriate.
Do not show the transpiled JavaScript, only the execution result.`;
      }
      
      if (lang === 'cpp' || lang === 'c') {
        return basePrompt + `
For ${lang === 'cpp' ? 'C++' : 'C'}, assume the code is compiled with ${lang === 'cpp' ? 'g++' : 'gcc'} and then executed.
Include any standard output and errors that would occur during compilation or execution.`;
      }
      
      return basePrompt;
    };

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.'
      }, { status: 500 });
    }

    // Generate prompt based on language
    const prompt = getPrompt(language, code);

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a precise code execution simulator that only shows program output." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2, // Low temperature for more deterministic results
      max_tokens: 1500
    });

    // Extract and clean up the response
    let output = response.choices[0]?.message.content?.trim() || 'No output';

    // If output starts with backticks, clean it up
    if (output.startsWith('```')) {
      // Extract content from code blocks if present
      const codeBlockMatch = output.match(/```(?:\w+)?\n([\s\S]+?)```/);
      output = codeBlockMatch ? codeBlockMatch[1].trim() : output.replace(/```(?:\w+)?\n|```/g, '').trim();
    }
    
    return NextResponse.json({
      output: output,
      error: '',
      language,
      source: 'ai'
    });
    
  } catch (error: unknown) {
    console.error('Error simulating code execution with OpenAI:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during AI code simulation';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 