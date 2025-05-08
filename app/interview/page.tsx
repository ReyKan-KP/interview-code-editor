"use client";
import { useState, useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import { CodeEditor } from "@/components/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code, FileCode, FileJson, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the interview questions
const questions = [
  {
    id: "01",
    title: "Question 01",
    description: "Write a Java program to find the factorial of a number.",
    codeLanguage: "java",
    codeStarter: `public class Main {
  public static void main(String[] args) {
    // Write your code here to find factorial
    int number = 5;
    
    
  }
}`,
  },
  {
    id: "02",
    title: "Question 02",
    description:
      "Create a simple HTML form with validation for email and password.",
    codeLanguage: "html",
    codeStarter: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form Validation</title>
  <style>
    /* Add your CSS here */
  </style>
</head>
<body>
  <!-- Create your form with validation here -->
  
  <script>
    // Add your validation script here
  </script>
</body>
</html>`,
  },
  {
    id: "03",
    title: "Question 03",
    description: "Implement a binary search algorithm in C++.",
    codeLanguage: "cpp",
    codeStarter: `#include <iostream>
#include <vector>
using namespace std;

// Implement binary search function here
int binarySearch(vector<int>& arr, int target) {
  // Write your code here
  
  
}

int main() {
  vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15};
  int target = 7;
  
  int result = binarySearch(arr, target);
  
  if (result != -1) {
    cout << "Element found at index " << result << endl;
  } else {
    cout << "Element not found in the array" << endl;
  }
  
  return 0;
}`,
  },
  {
    id: "04",
    title: "Question 04",
    description:
      "Implement a Linked List data structure with methods to add, remove, and find elements.",
    templates: [
      {
        language: "javascript",
        label: "JavaScript",
        starter: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  // Add a new node to the end of the list
  append(value) {
    // Your code here
  }
  
  // Add a new node to the beginning of the list
  prepend(value) {
    // Your code here
  }
  
  // Remove a node with the given value
  remove(value) {
    // Your code here
  }
  
  // Find a node with the given value
  find(value) {
    // Your code here
  }
  
  // Helper method to print the list
  printList() {
    let current = this.head;
    let result = "";
    while (current) {
      result += current.value + " -> ";
      current = current.next;
    }
    result += "null";
    console.log(result);
  }
}

// Test your implementation
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.prepend(0);
list.printList(); // Should print: 0 -> 1 -> 2 -> 3 -> null
list.remove(2);
list.printList(); // Should print: 0 -> 1 -> 3 -> null
console.log(list.find(1)); // Should return the node with value 1
console.log(list.find(5)); // Should return null
`,
      },
      {
        language: "python",
        label: "Python",
        starter: `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0
    
    # Add a new node to the end of the list
    def append(self, value):
        # Your code here
        pass
    
    # Add a new node to the beginning of the list
    def prepend(self, value):
        # Your code here
        pass
    
    # Remove a node with the given value
    def remove(self, value):
        # Your code here
        pass
    
    # Find a node with the given value
    def find(self, value):
        # Your code here
        pass
    
    # Helper method to print the list
    def print_list(self):
        current = self.head
        result = ""
        while current:
            result += str(current.value) + " -> "
            current = current.next
        result += "None"
        print(result)

# Test your implementation
list = LinkedList()
list.append(1)
list.append(2)
list.append(3)
list.prepend(0)
list.print_list()  # Should print: 0 -> 1 -> 2 -> 3 -> None
list.remove(2)
list.print_list()  # Should print: 0 -> 1 -> 3 -> None
print(list.find(1))  # Should return the node with value 1
print(list.find(5))  # Should return None
`,
      },
      {
        language: "cpp",
        label: "C++",
        starter: `#include <iostream>
using namespace std;

class Node {
public:
    int value;
    Node* next;
    
    Node(int val) : value(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
    int size;
    
public:
    LinkedList() : head(nullptr), size(0) {}
    
    // Add a new node to the end of the list
    void append(int value) {
        // Your code here
    }
    
    // Add a new node to the beginning of the list
    void prepend(int value) {
        // Your code here
    }
    
    // Remove a node with the given value
    void remove(int value) {
        // Your code here
    }
    
    // Find a node with the given value
    Node* find(int value) {
        // Your code here
        return nullptr;
    }
    
    // Helper method to print the list
    void printList() {
        Node* current = head;
        while (current) {
            cout << current->value << " -> ";
            current = current->next;
        }
        cout << "nullptr" << endl;
    }
};

int main() {
    LinkedList list;
    list.append(1);
    list.append(2);
    list.append(3);
    list.prepend(0);
    list.printList(); // Should print: 0 -> 1 -> 2 -> 3 -> nullptr
    list.remove(2);
    list.printList(); // Should print: 0 -> 1 -> 3 -> nullptr
    
    Node* found = list.find(1);
    if (found) {
        cout << "Found node with value: " << found->value << endl;
    }
    
    found = list.find(5);
    if (!found) {
        cout << "Node with value 5 not found" << endl;
    }
    
    return 0;
}
`,
      },
    ],
  },
  {
    id: "05",
    title: "Question 05",
    description:
      "Implement a solution for the 'Valid Parentheses' problem: Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.",
    templates: [
      {
        language: "javascript",
        label: "JavaScript",
        starter: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your solution here
  
}

// Test cases
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]")); // false
console.log(isValid("([)]")); // false
console.log(isValid("{[]}")); // true
`,
      },
      {
        language: "python",
        label: "Python",
        starter: `def is_valid(s):
    # Your solution here
    pass

# Test cases
print(is_valid("()"))        # True
print(is_valid("()[]{}"))    # True
print(is_valid("(]"))        # False
print(is_valid("([)]"))      # False
print(is_valid("{[]}"))      # True
`,
      },
    ],
  },
];

// Language icon mapping
const languageIcons = {
  javascript: Code,
  typescript: Code,
  html: FileCode,
  css: FileCode,
  json: FileJson,
  python: Code,
  java: Code,
  cpp: Code,
  c: Code,
  csharp: Code,
};

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Item animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function InterviewPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<string, boolean>>(
    {}
  );
  const [sessionId, setSessionId] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Generate a session ID and start time when the component mounts
    setSessionId(uuidv4());
    setStartTime(new Date().toISOString());
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const formatCodeForStorage = (code: string): string => {
    // Replace newlines with a special delimiter for storage
    return code.replace(/\n/g, "||");
  };

  const handleSubmitQuestion = async (questionId: string) => {
    try {
      setSubmitting((prev) => ({ ...prev, [questionId]: true }));

      const question = questions.find((q) => q.id === questionId);
      if (!question) return;

      let userSubmission: any = {
        question_id: questionId,
        question_description: question.description,
        user_content: answers[questionId + "-content"] || "",
        isSubmitted: true,
        submittedAt: new Date().toISOString(),
      };

      // Handle different question types (with or without templates)
      if (!question.templates) {
        userSubmission.initial_templates = {
          language: question.codeLanguage,
          label:
            question.codeLanguage.charAt(0).toUpperCase() +
            question.codeLanguage.slice(1),
          starter: formatCodeForStorage(question.codeStarter),
        };

        userSubmission.user_code_submission = {
          language: question.codeLanguage,
          label:
            question.codeLanguage.charAt(0).toUpperCase() +
            question.codeLanguage.slice(1),
          user_code: formatCodeForStorage(
            answers[questionId + "-code"] || question.codeStarter
          ),
        };
      } else {
        userSubmission.initial_templates = question.templates.map(
          (template: any) => ({
            language: template.language,
            label: template.label,
            starter: formatCodeForStorage(template.starter),
          })
        );

        userSubmission.user_code_submission = question.templates.map(
          (template: any) => ({
            language: template.language,
            label: template.label,
            user_code: formatCodeForStorage(
              answers[questionId + "-" + template.language] || template.starter
            ),
          })
        );
      }

      // Submit individual question with questionId as the key
      const response = await fetch("/api/data-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          startTime,
          user_submissions: {
            [questionId]: userSubmission,
          },
        }),
      });

      if (response.ok) {
        setQuestionStatus((prev) => ({ ...prev, [questionId]: true }));
        toast({
          title: "Question Submitted",
          description: `Question ${questionId} has been successfully submitted.`,
        });
      } else {
        throw new Error("Failed to submit question");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmSubmitAll = async () => {
    handleCloseDialog();
    try {
      setIsSubmittingAll(true);

      // Prepare all question submissions as an object with questionId keys
      const allSubmissions: Record<string, any> = {};

      questions.forEach((question) => {
        let userSubmission: any = {
          question_id: question.id,
          question_description: question.description,
          user_content: answers[question.id + "-content"] || "",
          isSubmitted: true,
          submittedAt: new Date().toISOString(),
        };

        // Handle different question types (with or without templates)
        if (!question.templates) {
          userSubmission.initial_templates = {
            language: question.codeLanguage,
            label:
              question.codeLanguage.charAt(0).toUpperCase() +
              question.codeLanguage.slice(1),
            starter: formatCodeForStorage(question.codeStarter),
          };

          userSubmission.user_code_submission = {
            language: question.codeLanguage,
            label:
              question.codeLanguage.charAt(0).toUpperCase() +
              question.codeLanguage.slice(1),
            user_code: formatCodeForStorage(
              answers[question.id + "-code"] || question.codeStarter
            ),
          };
        } else {
          userSubmission.initial_templates = question.templates.map(
            (template: any) => ({
              language: template.language,
              label: template.label,
              starter: formatCodeForStorage(template.starter),
            })
          );

          userSubmission.user_code_submission = question.templates.map(
            (template: any) => ({
              language: template.language,
              label: template.label,
              user_code: formatCodeForStorage(
                answers[question.id + "-" + template.language] ||
                  template.starter
              ),
            })
          );
        }

        allSubmissions[question.id] = userSubmission;
      });

      // Submit all questions at once
      const response = await fetch("/api/data-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          startTime,
          user_submissions: allSubmissions,
        }),
      });

      if (response.ok) {
        // Mark all questions as submitted
        const newStatus: Record<string, boolean> = {};
        questions.forEach((q) => {
          newStatus[q.id] = true;
        });
        setQuestionStatus(newStatus);

        toast({
          title: "Test Submitted",
          description: "All questions have been successfully submitted.",
        });

        // Trigger AI evaluation and redirect to feedback page with sessionId
        try {
          await fetch("/api/evalution-and-feedback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          });
        } catch (evalError) {
          console.error("Error triggering evaluation:", evalError);
          // Continue with redirection even if evaluation fails
        }

        // Redirect to feedback page with sessionId
        router.push(`/feedback?sessionId=${encodeURIComponent(sessionId)}`);
      } else {
        throw new Error("Failed to submit test");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingAll(false);
    }
  };

  return (
    <div className="min-h-screen py-8 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600"
      >
        Technical Interview
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center gap-8 w-full px-4"
      >
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            variants={itemVariants}
            className="w-full max-w-4xl"
          >
            <Card className="border border-gray-200 shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-blue-600">
                    {question.title}
                  </CardTitle>
                  {questionStatus[question.id] && (
                    <span className="flex items-center text-green-600 text-sm">
                      <Check className="h-4 w-4 mr-1" /> Submitted
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="question" className="w-full">
                  <TabsList className="w-full justify-start border-b border-gray-200 rounded-none h-12 bg-gray-50 p-0">
                    <TabsTrigger
                      value="question"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 h-12 px-6 text-gray-600"
                    >
                      Question
                    </TabsTrigger>
                    <TabsTrigger
                      value="code-editor"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 h-12 px-6 text-gray-600"
                    >
                      Code Editor
                    </TabsTrigger>
                    <TabsTrigger
                      value="content"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 h-12 px-6 text-gray-600"
                    >
                      Content
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="question" className="p-6 bg-white">
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700">{question.description}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="code-editor" className="p-0 border-0">
                    {!question.templates ? (
                      <>
                        <div className="p-4 flex items-center gap-2 border-b border-gray-200 bg-gray-50">
                          <div className="font-medium text-gray-700">
                            Language:
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {languageIcons[
                              question.codeLanguage as keyof typeof languageIcons
                            ] &&
                              React.createElement(
                                languageIcons[
                                  question.codeLanguage as keyof typeof languageIcons
                                ],
                                { className: "h-4 w-4 text-blue-600" }
                              )}
                            <span className="text-blue-600">
                              {question.codeLanguage.charAt(0).toUpperCase() +
                                question.codeLanguage.slice(1)}
                            </span>
                          </div>
                        </div>
                        <CodeEditor
                          language={question.codeLanguage}
                          defaultValue={
                            answers[question.id + "-code"] ||
                            question.codeStarter
                          }
                          height="400px"
                          onChange={(value) =>
                            handleAnswerChange(
                              question.id + "-code",
                              value || ""
                            )
                          }
                        />
                      </>
                    ) : (
                      <Tabs
                        defaultValue={question.templates[0].language}
                        className="w-full"
                      >
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                          <div className="font-medium mb-2 text-gray-700">
                            Templates:
                          </div>
                          <TabsList className="bg-white border border-gray-200">
                            {question.templates.map((template) => (
                              <TabsTrigger
                                key={template.language}
                                value={template.language}
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-green-500/30"
                              >
                                {template.label}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </div>

                        {question.templates.map((template) => (
                          <TabsContent
                            key={template.language}
                            value={template.language}
                            className="p-0 border-0"
                          >
                            <CodeEditor
                              language={template.language}
                              defaultValue={
                                answers[
                                  question.id + "-" + template.language
                                ] || template.starter
                              }
                              height="400px"
                              onChange={(value) =>
                                handleAnswerChange(
                                  question.id + "-" + template.language,
                                  value || ""
                                )
                              }
                            />
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
                  </TabsContent>

                  <TabsContent value="content" className="p-6 bg-white">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-blue-600">
                        Provide your explanation:
                      </h3>
                      <Textarea
                        placeholder="Enter your answer or explanation here..."
                        className="min-h-[200px] bg-white border-gray-200 text-gray-800 placeholder:text-gray-400"
                        value={answers[question.id + "-content"] || ""}
                        onChange={(e) =>
                          handleAnswerChange(
                            question.id + "-content",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-end border-t border-gray-200">
                <Button
                  onClick={() => handleSubmitQuestion(question.id)}
                  disabled={submitting[question.id] || isSubmittingAll}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                >
                  {submitting[question.id] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : questionStatus[question.id] ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Resubmit
                    </>
                  ) : (
                    "Submit Question"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl flex justify-center my-8"
        >
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                onClick={handleOpenDialog}
                disabled={isSubmittingAll}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 px-8 text-lg"
                size="lg"
              >
                {isSubmittingAll ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting All Questions...
                  </>
                ) : (
                  "Submit All Questions"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-gray-200 text-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-blue-600">
                  Confirm Submission
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Are you sure you want to submit all questions? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white border-none"
                  onClick={handleConfirmSubmitAll}
                >
                  Submit All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </motion.div>
    </div>
  );
}
