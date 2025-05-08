import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/client';

// Initialize Supabase client
const supabase = await createClient();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prepare data for OpenAI by replacing code delimiters with newlines
const prepareDataForEvaluation = (submissionData: any) => {
  const processedData = JSON.parse(JSON.stringify(submissionData));
  
  // Process each submission
  Object.keys(processedData.user_submissions).forEach(questionId => {
    const submission = processedData.user_submissions[questionId];
    
    // Format initial templates
    if (submission.initial_templates) {
      if (Array.isArray(submission.initial_templates)) {
        // Handle array of templates
        submission.initial_templates.forEach((template: any) => {
          if (template.starter) {
            template.starter = template.starter.replace(/\|\|/g, "\n");
          }
        });
      } else {
        // Handle single template
        if (submission.initial_templates.starter) {
          submission.initial_templates.starter = submission.initial_templates.starter.replace(/\|\|/g, "\n");
        }
      }
    }
    
    // Format user code submissions
    if (submission.user_code_submission) {
      if (Array.isArray(submission.user_code_submission)) {
        // Handle array of code submissions
        submission.user_code_submission.forEach((code: any) => {
          if (code.user_code) {
            code.user_code = code.user_code.replace(/\|\|/g, "\n");
          }
        });
      } else {
        // Handle single code submission
        if (submission.user_code_submission.user_code) {
          submission.user_code_submission.user_code = submission.user_code_submission.user_code.replace(/\|\|/g, "\n");
        }
      }
    }
  });
  
  return processedData;
};

// Function to check if the user has made changes to the code
const hasAttempted = (starterCode: string, userCode: string): boolean => {
  return starterCode !== userCode;
};

const evaluatorPrompt = `
You are an expert technical evaluator for coding interviews. Your task is to analyze and provide a detailed evaluation of a candidate's interview submissions.

CONTEXT: 
- The data contains multiple coding questions and the candidate's submissions.
- For each question, you'll see the question description, initial starter code template, and the candidate's submission.
- Some questions might have multiple language templates. If so, evaluate the best attempt among them.
- The "||" in the code represents newline characters. Mentally replace them with actual newlines when reading code.
- If the starter code and user code are identical, it means the candidate hasn't attempted that question.

EVALUATION GUIDELINES:
1. Evaluate each question independently, providing:
   - Code correctness: Does the solution work as expected?
   - Code quality: Is the code well-structured, efficient, and maintainable?
   - Problem-solving approach: Did they use an appropriate algorithm/approach?
   - Areas for improvement: What could be enhanced?

2. For each question, provide a score from 1-10 and brief justification.

3. After evaluating all questions, provide an overall assessment, including:
   - Strengths demonstrated
   - Areas for improvement
   - Technical skill level (Beginner, Intermediate, Advanced)
   - Overall score (1-10)
   - Hiring recommendation (Not Recommended, Consider, Recommended, Highly Recommended)

RESPONSE FORMAT REQUIREMENTS:
1. Return ONLY the JSON object without any explanation, markdown formatting, or code blocks
2. DO NOT include any text before or after the JSON
3. DO NOT use backticks in your response
4. Ensure the JSON is properly formatted and valid

JSON SCHEMA:
{
  "questionEvaluations": {
    "01": {
      "attemptedFlag": true,
      "evaluation": "Detailed evaluation here...",
      "score": 7,
      "strengths": ["Strength 1", "Strength 2"],
      "improvements": ["Improvement 1", "Improvement 2"]
    }
  },
  "overallAssessment": {
    "summary": "Overall assessment summary",
    "strengths": ["Strength 1", "Strength 2"],
    "improvements": ["Improvement 1", "Improvement 2"],
    "technicalLevel": "Beginner/Intermediate/Advanced",
    "overallScore": 7,
    "recommendation": "Not Recommended/Consider/Recommended/Highly Recommended"
  }
}
`;

const feedbackPrompt = `
You are an AI assistant providing helpful, constructive feedback on coding interview submissions. Your goal is to give candidates encouraging but honest feedback to help them improve.

CONTEXT:
- The data contains multiple coding questions and the candidate's submissions.
- For each question, you'll see the question description, initial starter code template, and the candidate's submission.
- Some questions might have multiple language templates. If so, evaluate the best attempt among them.
- The "||" in the code represents newline characters. Mentally replace them with actual newlines when reading code.
- If the starter code and user code are identical, it means the candidate hasn't attempted that question.

FEEDBACK GUIDELINES:
1. Be constructive and encouraging, but honest about areas for improvement.
2. Focus on the most important 2-3 points for each question rather than an exhaustive critique.
3. Use a friendly, supportive tone throughout.
4. Provide specific suggestions for improvement, not just identification of problems.
5. Highlight what they did well to build confidence.

RESPONSE FORMAT REQUIREMENTS:
1. Return ONLY the JSON object without any explanation, markdown formatting, or code blocks
2. DO NOT include any text before or after the JSON
3. DO NOT use backticks in your response
4. Ensure the JSON is properly formatted and valid

JSON SCHEMA:
{
  "overallFeedback": "A paragraph summarizing overall performance and main strengths/areas for improvement",
  "questionFeedback": {
    "01": {
      "attempted": true,
      "positiveFeedback": "What they did well",
      "areasForImprovement": "Constructive suggestions for improvement",
      "tipForFuture": "A specific learning tip they can apply"
    }
  },
  "nextSteps": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "resources": ["Resource 1", "Resource 2", "Resource 3"]
}
`;

// Helper function to safely parse JSON that might be wrapped in markdown code blocks
const safeJsonParse = (jsonString: string): any => {
  if (!jsonString) return {};
  
  try {
    // Try to parse directly first
    return JSON.parse(jsonString);
  } catch (error) {
    // If direct parsing fails, try cleaning potential markdown formatting
    try {
      // Remove markdown code block formatting if present
      let cleanedString = jsonString
        .replace(/^```json\s*/gm, '') // Remove opening ```json
        .replace(/^```\s*/gm, '')     // Remove opening ``` without language
        .replace(/\s*```$/gm, '');    // Remove closing ```
      
      // Trim any whitespace
      cleanedString = cleanedString.trim();
      
      // Log the cleaned string for debugging
      console.log('Cleaned JSON string:', cleanedString.substring(0, 100) + '...');
      
      return JSON.parse(cleanedString);
    } catch (parseError) {
      console.error('Failed to parse JSON after cleaning:', parseError);
      // Return empty object as fallback
      return {};
    }
  }
};

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch submission data from Supabase
    const { data: submissionData, error: fetchError } = await supabase
      .from('interview_submissions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (fetchError || !submissionData) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Process the data for evaluation
    const processedData = prepareDataForEvaluation(submissionData);
    
    // Generate detailed evaluation for interviewers
    const evaluationResponse = await openai.chat.completions.create({
      model: "gpt-4o", // Updated to current model
      messages: [
        { role: "system", content: "You are an expert coding evaluator. Your responses must be valid JSON only, with no other text." },
        { role: "system", content: evaluatorPrompt },
        { role: "user", content: JSON.stringify(processedData) }
      ],
      response_format: { type: "json_object" }, // Force JSON response format
      temperature: 0.2, // Lower temperature for more consistent evaluations
    });
    
    // Generate user-friendly feedback
    const feedbackResponse = await openai.chat.completions.create({
      model: "gpt-4o", // Updated to current model
      messages: [
        { role: "system", content: "You are an AI feedback assistant. Your responses must be valid JSON only, with no other text." },
        { role: "system", content: feedbackPrompt },
        { role: "user", content: JSON.stringify(processedData) }
      ],
      response_format: { type: "json_object" }, // Force JSON response format
      temperature: 0.3, // Slightly higher for more natural tone
    });
    
    console.log("Evaluation response content:", evaluationResponse.choices[0].message.content?.substring(0, 100) + '...');
    console.log("Feedback response content:", feedbackResponse.choices[0].message.content?.substring(0, 100) + '...');
    
    // Extract the evaluation and feedback with safe parsing
    const evaluation = safeJsonParse(evaluationResponse.choices[0].message.content || "{}");
    const feedback = safeJsonParse(feedbackResponse.choices[0].message.content || "{}");
    
    // Save detailed evaluation to Supabase
    const { error: evaluationError } = await supabase
      .from('interview_evaluation')
      .insert({
        session_id: sessionId,
        evaluation_data: evaluation,
        feedback_data: feedback,
        created_at: new Date().toISOString()
      });
    
    if (evaluationError) {
      console.error('Error saving evaluation to Supabase:', evaluationError);
    }
    
    // Return the feedback to display to the user
    return NextResponse.json({
      success: true,
      feedback
    });
    
  } catch (error: any) {
    console.error('Error generating evaluation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate evaluation',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
