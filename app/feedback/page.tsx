"use client"
import React, { useEffect, useState, Suspense } from "react"
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

function FeedbackClient() {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 text-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 text-center">
          Thank You for Completing the Interview
        </h1>
        
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center shadow-md">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Generating your personalized feedback...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a minute or two.</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-md">
            <div className="text-red-500 mb-4 text-center text-lg">
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
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </div>
        ) : feedback ? (
          <div className="space-y-6">
            <Card className="border border-gray-200 shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-gray-50 p-6 border-b border-gray-200">
                <CardTitle className="text-xl text-blue-600">Overall Assessment</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-6">{feedback.overallFeedback}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="border border-gray-200 bg-gray-50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md text-green-600">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <ul className="list-disc pl-5 space-y-1">
                        {feedback.nextSteps.map((step, index) => (
                          <li key={index} className="text-gray-700 text-sm">{step}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 bg-gray-50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md text-purple-600">Recommended Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <ul className="list-disc pl-5 space-y-1">
                        {feedback.resources.map((resource, index) => (
                          <li key={index} className="text-gray-700 text-sm">{resource}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-gray-50 p-6 border-b border-gray-200">
                <CardTitle className="text-xl text-blue-600">Question-by-Question Feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue={Object.keys(feedback.questionFeedback)[0]} className="w-full">
                  <TabsList className="w-full justify-start overflow-auto flex-wrap bg-gray-100 py-1 px-1 border border-gray-200 rounded-md">
                    {Object.entries(feedback.questionFeedback).map(([questionId, questionData]) => (
                      <TabsTrigger 
                        key={questionId} 
                        value={questionId}
                        className="rounded-md px-3 py-1 m-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-green-500/30"
                      >
                        Question {questionId}
                        {!questionData.attempted && (
                          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            Not Attempted
                          </span>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {Object.entries(feedback.questionFeedback).map(([questionId, questionData]) => (
                    <TabsContent key={questionId} value={questionId} className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                      {!questionData.attempted ? (
                        <div className="text-amber-800 p-4 rounded-md bg-amber-50 mb-4 border border-amber-200">
                          <p>You didn't attempt this question. Try it next time!</p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
                            <h3 className="text-green-700 font-medium mb-2">What You Did Well</h3>
                            <p className="text-gray-700">{questionData.positiveFeedback}</p>
                          </div>
                          
                          <div className="mb-4 p-4 rounded-md bg-blue-50 border border-blue-200">
                            <h3 className="text-blue-700 font-medium mb-2">Areas for Improvement</h3>
                            <p className="text-gray-700">{questionData.areasForImprovement}</p>
                          </div>
                          
                          <div className="p-4 rounded-md bg-purple-50 border border-purple-200">
                            <h3 className="text-purple-700 font-medium mb-2">Tip for the Future</h3>
                            <p className="text-gray-700">{questionData.tipForFuture}</p>
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
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-5 px-6"
                size="lg"
              >
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 text-center shadow-md">
            <p className="text-gray-600">No feedback available.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 text-gray-800 p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center shadow-md">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Loading feedback...</p>
        </div>
      </div>
    }>
      <FeedbackClient />
    </Suspense>
  );
}