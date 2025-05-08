"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

interface FeedbackData {
  overallFeedback: string;
  questionFeedback: Record<string, {
    attempted: boolean;
    positiveFeedback: string;
    areasForImprovement: string;
    tipForFuture: string;
  }>;
  nextSteps: string[];
  resources: string[];
}

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!sessionId) {
        setError("Session ID is missing. Unable to retrieve your feedback.");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/evalution-and-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch feedback (${response.status})`);
        }
        
        const data = await response.json();
        if (data.success && data.feedback) {
          setFeedback(data.feedback);
        } else {
          throw new Error(data.error || 'Failed to load feedback');
        }
      } catch (err: any) {
        console.error('Error fetching feedback:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeedback();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 text-center">
          Thank You for Completing the Interview
        </h1>
        
        {isLoading ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-300 text-lg">Generating your personalized feedback...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a minute or two.</p>
          </div>
        ) : error ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 mb-8">
            <div className="text-red-400 mb-4 text-center text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h2 className="text-xl font-bold mb-2">Error Loading Feedback</h2>
              <p>{error}</p>
            </div>
            <div className="flex justify-center mt-6">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
              >
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </div>
        ) : feedback ? (
          <div className="space-y-6">
            <Card className="border border-gray-800 shadow-lg bg-gray-900/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gray-800/50 p-6">
                <CardTitle className="text-xl text-blue-400">Overall Assessment</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 mb-6">{feedback.overallFeedback}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="border border-gray-700 bg-gray-800/30">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md text-green-400">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <ul className="list-disc pl-5 space-y-1">
                        {feedback.nextSteps.map((step, index) => (
                          <li key={index} className="text-gray-300 text-sm">{step}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-700 bg-gray-800/30">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md text-purple-400">Recommended Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <ul className="list-disc pl-5 space-y-1">
                        {feedback.resources.map((resource, index) => (
                          <li key={index} className="text-gray-300 text-sm">{resource}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-800 shadow-lg bg-gray-900/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gray-800/50 p-6">
                <CardTitle className="text-xl text-blue-400">Question-by-Question Feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue={Object.keys(feedback.questionFeedback)[0]} className="w-full">
                  <TabsList className="w-full justify-start overflow-auto flex-wrap bg-gray-800/70 py-1 px-1">
                    {Object.entries(feedback.questionFeedback).map(([questionId, questionData]) => (
                      <TabsTrigger 
                        key={questionId} 
                        value={questionId}
                        className="rounded-md px-3 py-1 m-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/50 data-[state=active]:to-green-600/50"
                      >
                        Question {questionId}
                        {!questionData.attempted && (
                          <span className="ml-2 text-xs bg-yellow-800/40 text-yellow-200 px-1.5 py-0.5 rounded">
                            Not Attempted
                          </span>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {Object.entries(feedback.questionFeedback).map(([questionId, questionData]) => (
                    <TabsContent key={questionId} value={questionId} className="mt-4 bg-gray-800/20 p-4 rounded-md">
                      {!questionData.attempted ? (
                        <div className="text-yellow-300 p-4 rounded-md bg-yellow-950/20 mb-4">
                          <p>You didn't attempt this question. Try it next time!</p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 p-4 rounded-md bg-green-950/20">
                            <h3 className="text-green-400 font-medium mb-2">What You Did Well</h3>
                            <p className="text-gray-300">{questionData.positiveFeedback}</p>
                          </div>
                          
                          <div className="mb-4 p-4 rounded-md bg-blue-950/20">
                            <h3 className="text-blue-400 font-medium mb-2">Areas for Improvement</h3>
                            <p className="text-gray-300">{questionData.areasForImprovement}</p>
                          </div>
                          
                          <div className="p-4 rounded-md bg-purple-950/20">
                            <h3 className="text-purple-400 font-medium mb-2">Tip for the Future</h3>
                            <p className="text-gray-300">{questionData.tipForFuture}</p>
                          </div>
                        </>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-8">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-5 px-6"
                size="lg"
              >
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 mb-8 text-center">
            <p className="text-gray-300">No feedback available.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}