import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if the OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          available: false,
          message: 'OpenAI API key is not configured' 
        }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        available: true,
        message: 'OpenAI API key is configured' 
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error checking OpenAI API key:', error);
    return NextResponse.json(
      { 
        available: false,
        message: 'Error checking OpenAI API key' 
      }, 
      { status: 500 }
    );
  }
} 