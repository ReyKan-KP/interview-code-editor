"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CodeEditor } from '@/components/code-editor'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, AlertTriangle, Sparkles } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

// Example code snippets for various languages
const languageExamples = {
  javascript: `// JavaScript Example
console.log("Hello from JavaScript!");

// Create an array and perform operations
const numbers = [1, 2, 3, 4, 5];
console.log("Sum:", numbers.reduce((a, b) => a + b, 0));
console.log("Squares:", numbers.map(n => n * n));

// Return a value
return "JavaScript execution complete!";`,

  typescript: `// TypeScript Example - compatible with our execution environment
// Note: Don't use export statements in this environment

interface Person {
  name: string;
  age: number;
}

// Create an object with type safety
const person: Person = {
  name: "TypeScript User",
  age: 25
};

console.log(\`Hello, \${person.name}!\`);
console.log(\`You are \${person.age} years old.\`);

// Array with explicit typing
const numbers: number[] = [1, 2, 3, 4, 5];
const sum: number = numbers.reduce((a, b) => a + b, 0);

console.log(\`Sum of numbers: \${sum}\`);

// Function with type annotations
function greet(name: string, age: number): string {
  return \`Greetings, \${name}! You are \${age} years old.\`;
}

console.log(greet("TypeScript Fan", 30));`,

  python: `# Python Example
print("Hello from Python!")

# Define a function
def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n-1)

# Calculate and print factorials
for i in range(1, 6):
    print(f"Factorial of {i} is {factorial(i)}")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)`,

  java: `// Java Example
public class Program {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        
        // Create an array and perform operations
        int[] numbers = {1, 2, 3, 4, 5};
        
        int sum = 0;
        System.out.print("Numbers: ");
        
        for (int num : numbers) {
            System.out.print(num + " ");
            sum += num;
        }
        
        System.out.println("\\nSum: " + sum);
        System.out.println("Average: " + (double)sum / numbers.length);
    }
}`,

  cpp: `// C++ Example
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::cout << "Hello from C++!" << std::endl;
    
    // Create a vector and perform operations
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    std::cout << "Numbers: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    
    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "\\nSum: " << sum << std::endl;
    std::cout << "Average: " << static_cast<double>(sum) / numbers.size() << std::endl;
    
    return 0;
}`,

  c: `// C Example
#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    
    // Create an array and perform operations
    int numbers[] = {1, 2, 3, 4, 5};
    int length = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Numbers: ");
    int sum = 0;
    
    for (int i = 0; i < length; i++) {
        printf("%d ", numbers[i]);
        sum += numbers[i];
    }
    
    printf("\\nSum: %d\\n", sum);
    printf("Average: %.2f\\n", (float)sum / length);
    
    return 0;
}`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Example</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #2563eb;
    }
    .card {
      background-color: #f9fafb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
      border-left: 4px solid #2563eb;
    }
    button {
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #1d4ed8;
    }
    #counter {
      font-weight: bold;
      font-size: 24px;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <h1>HTML Live Preview Example</h1>
  
  <div class="container">
    <h2>Interactive Counter</h2>
    <div class="card">
      <p>This is a simple interactive counter built with HTML, CSS, and JavaScript.</p>
      <div style="display: flex; align-items: center; margin-top: 15px;">
        <span id="counter">0</span>
        <button onclick="incrementCounter()">Increment</button>
        <button onclick="resetCounter()" style="margin-left: 10px; background-color: #64748b;">Reset</button>
      </div>
    </div>
    
    <h2>Dynamic Content</h2>
    <div class="card">
      <p>Current date and time: <span id="datetime"></span></p>
    </div>
  </div>

  <script>
    // Counter functionality
    let count = 0;
    const counterElement = document.getElementById('counter');
    
    function incrementCounter() {
      count++;
      counterElement.textContent = count;
    }
    
    function resetCounter() {
      count = 0;
      counterElement.textContent = count;
    }
    
    // Update date and time
    function updateDateTime() {
      const now = new Date();
      document.getElementById('datetime').textContent = now.toLocaleString();
    }
    
    // Initialize
    updateDateTime();
    setInterval(updateDateTime, 1000);
  </script>
</body>
</html>`
};

type LanguageKey = keyof typeof languageExamples;

export default function MultiLanguageRunner() {
  const [language, setLanguage] = useState<LanguageKey>('javascript');
  const [isClientSide, setIsClientSide] = useState(true);
  const [isAiExecution, setIsAiExecution] = useState(false);
  
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as LanguageKey);
    // JavaScript and HTML can run client-side, others need server
    setIsClientSide(newLanguage === 'javascript' || newLanguage === 'html');
    // TypeScript, C, and C++ use AI execution
    setIsAiExecution(
      newLanguage === 'typescript' || 
      newLanguage === 'c' || 
      newLanguage === 'cpp' ||
      newLanguage === 'java' ||
      newLanguage === 'python'
    );
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Multi-Language Code Runner</h1>
      
      {/* {!isClientSide && !isAiExecution && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Server-side execution notice</AlertTitle>
          <AlertDescription>
            {language === 'python' && "Python execution requires Python to be installed on the server."}
            {language === 'java' && "Java execution requires the Java Development Kit (JDK) to be installed on the server."}
            <br/><br/>
            If you encounter errors, it may be because the required tools are not installed on the server environment.
          </AlertDescription>
        </Alert>
      )} */}
      
      {isAiExecution  && (
        <Alert className="mb-6 border-purple-200 bg-purple-50 text-purple-800">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <AlertTitle>AI-powered code execution</AlertTitle>
          <AlertDescription>
            {language === 'typescript' && "TypeScript code is executed using AI simulation."}
            {language === 'c' && "C code is executed using AI simulation."}
            {language === 'cpp' && "C++ code is executed using AI simulation."}
            <br/><br/>
            The AI will simulate running your code and show the expected output. This requires an OpenAI API key to be configured on the server.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Language Selection</CardTitle>
                <CardDescription>
                  Choose a programming language to execute. Each language uses a different execution environment.
                </CardDescription>
              </div>
              <div>
                {isClientSide && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Client-side execution
                  </Badge>
                )}
                {!isClientSide && !isAiExecution && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Server-side execution
                  </Badge>
                )}
                {isAiExecution && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI-powered execution
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          {/* {language === 'java' && (
            <CardFooter className="border-t pt-4">
              <Link 
                href="/code-runner/java" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                Try our specialized Java runner with more examples
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          )} */}
        </Card>
      </div>
      
      <div className="mb-6">
        <CodeEditor 
          language={language}
          defaultValue={languageExamples[language]}
          height="500px"
          serverExecution={!isClientSide}
          forceAI={isAiExecution}
        />
      </div>
      
      <Card className="bg-white shadow-sm mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={isAiExecution ? "ai" : (isClientSide ? "client" : "server")}>
            <TabsList className="mb-4">
              <TabsTrigger value="client">Client-Side Execution</TabsTrigger>
              {/* <TabsTrigger value="server">Server-Side Execution</TabsTrigger> */}
              <TabsTrigger value="ai">AI-Powered Execution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="client">
              <ul className="list-disc pl-6 space-y-2">
                <li>JavaScript code runs directly in your browser</li>
                <li>Console.log statements are captured and displayed in the output panel</li>
                <li>It's fast because no network request is needed</li>
                <li>Limited to browser capabilities and security restrictions</li>
              </ul>
            </TabsContent>
            
            {/* <TabsContent value="server">
              <ul className="list-disc pl-6 space-y-2">
                <li>Code is sent to the server for execution</li>
                <li>Supports Python and Java languages</li>
                <li>The server creates temporary files, compiles if needed, and runs the code</li>
                <li>Standard output and errors are captured and returned to the browser</li>
                <li>Execution time is limited to prevent long-running programs</li>
              </ul>
            </TabsContent> */}
            
            <TabsContent value="ai">
              <ul className="list-disc pl-6 space-y-2">
                <li>Code is sent to OpenAI's API for execution simulation</li>
                <li>Used for TypeScript, C, C++, Java, and Python code</li>
                <li>The AI analyzes your code and predicts what the output would be</li>
                <li>This method doesn't require compilers to be installed on the server</li>
                <li>Results are typically accurate but might differ slightly from actual execution</li>
                <li>Requires an OpenAI API key to be configured on the server</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 