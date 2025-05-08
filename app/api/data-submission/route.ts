import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Helper function to ensure code is properly formatted for storage
const ensureCodeFormatting = (submissions: any) => {
  // Process each question submission
  Object.keys(submissions).forEach(questionId => {
    const submission = submissions[questionId];
    
    // Format initial templates
    if (submission.initial_templates) {
      if (Array.isArray(submission.initial_templates)) {
        // Handle array of templates
        submission.initial_templates = submission.initial_templates.map((template: any) => ({
          ...template,
          starter: typeof template.starter === 'string' 
            ? template.starter.replace(/\n/g, "||") 
            : template.starter
        }));
      } else {
        // Handle single template
        submission.initial_templates.starter = typeof submission.initial_templates.starter === 'string'
          ? submission.initial_templates.starter.replace(/\n/g, "||")
          : submission.initial_templates.starter;
      }
    }
    
    // Format user code submissions
    if (submission.user_code_submission) {
      if (Array.isArray(submission.user_code_submission)) {
        // Handle array of code submissions
        submission.user_code_submission = submission.user_code_submission.map((code: any) => ({
          ...code,
          user_code: typeof code.user_code === 'string' 
            ? code.user_code.replace(/\n/g, "||") 
            : code.user_code
        }));
      } else {
        // Handle single code submission
        submission.user_code_submission.user_code = typeof submission.user_code_submission.user_code === 'string'
          ? submission.user_code_submission.user_code.replace(/\n/g, "||")
          : submission.user_code_submission.user_code;
      }
    }
  });
  
  return submissions;
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { sessionId, startTime, user_submissions } = data;
    
    // Create session ID if not provided
    const finalSessionId = sessionId || uuidv4();
    
    // Check if file already exists to update instead of overwrite
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, `questions_submission_${finalSessionId}.json`);
    
    // Ensure all code is properly formatted
    const formattedSubmissions = ensureCodeFormatting(user_submissions);
    
    let submissionData = {
      sessionId: finalSessionId,
      startTime: startTime || new Date().toISOString(),
      user_submissions: {}
    };
    
    // If file exists, read it first to merge submissions
    if (fs.existsSync(filePath)) {
      const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      submissionData = {
        ...existingData,
        user_submissions: {
          ...existingData.user_submissions,
          ...formattedSubmissions
        }
      };
    } else {
      // Ensure data directory exists
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      submissionData.user_submissions = formattedSubmissions;
    }
    
    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(submissionData, null, 2));
    
    return NextResponse.json({ success: true, sessionId: finalSessionId });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save submission' }, 
      { status: 500 }
    );
  }
}
