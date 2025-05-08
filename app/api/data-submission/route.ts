import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/client';

const supabase = await createClient();

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
    const submissionTime = startTime || new Date().toISOString();
    
    // Ensure all code is properly formatted
    const formattedSubmissions = ensureCodeFormatting(user_submissions);
    
    // Check if submission already exists
    const { data: existingSubmission } = await supabase
      .from('interview_submissions')
      .select('user_submissions')
      .eq('session_id', finalSessionId)
      .single();
    
    if (existingSubmission) {
      // Update existing submission
      const mergedSubmissions = {
        ...existingSubmission.user_submissions,
        ...formattedSubmissions
      };
      
      const { error: updateError } = await supabase
        .from('interview_submissions')
        .update({
          user_submissions: mergedSubmissions,
          updated_at: new Date().toISOString()
        })
        .eq('session_id', finalSessionId);
      
      if (updateError) throw updateError;
    } else {
      // Create new submission
      const { error: insertError } = await supabase
        .from('interview_submissions')
        .insert({
          session_id: finalSessionId,
          start_time: submissionTime,
          user_submissions: formattedSubmissions,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
    }
    
    return NextResponse.json({ success: true, sessionId: finalSessionId });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save submission' }, 
      { status: 500 }
    );
  }
}
