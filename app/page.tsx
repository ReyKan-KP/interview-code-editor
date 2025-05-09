"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { ArrowRight, Code, Brain, Trophy, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const Page = () => {
  // Function to start a new practice session
  const startNewSession = () => {
    // Generate a new session ID
    const sessionId = uuidv4();
    
    // Clear previous localStorage data related to code submissions
    if (typeof window !== 'undefined') {
      // Get all keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Only remove keys related to questions
        if (key && (key.startsWith('question-') || key === 'question-submissions')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove the keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
    
    // Store the new session ID
    localStorage.setItem('interview-session-id', sessionId);
  };

  return (
    <main className="h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100 text-gray-800 items-center justify-center">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 z-0"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-5xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
            Master Your Coding Skills
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
            Elevate your programming expertise with our interactive coding environment. 
            Practice real-world problems and ace your technical interviews.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/interview" 
                onClick={startNewSession}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all group text-white"
              >
                Start Practicing
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/code-runner" 
                className="inline-flex items-center px-8 py-4 bg-white border border-gray-200 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all group text-gray-800"
              >
                Try Code Runner
                <Terminal className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      {/* <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:shadow-md hover:shadow-blue-900/20"
            >
              <div className="bg-blue-900/30 p-3 rounded-lg w-fit mb-4">
                <Code className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Editor</h3>
              <p className="text-gray-300">Practice with our fully-featured code editor that supports multiple languages and real-time syntax highlighting.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all hover:shadow-md hover:shadow-green-900/20"
            >
              <div className="bg-green-900/30 p-3 rounded-lg w-fit mb-4">
                <Brain className="text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interview Preparation</h3>
              <p className="text-gray-300">Tackle common interview questions spanning algorithms, data structures, and language-specific challenges.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all hover:shadow-md hover:shadow-purple-900/20"
            >
              <div className="bg-purple-900/30 p-3 rounded-lg w-fit mb-4">
                <Trophy className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Skill Development</h3>
              <p className="text-gray-300">Enhance your programming abilities through practice across multiple languages and frameworks.</p>
            </motion.div>
          </div>
        </div>
      </section> */}
      
      {/* CTA Section */}
      {/* <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-900/50 to-green-900/50 p-10 rounded-2xl border border-gray-700"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Coding?</h2>
            <p className="text-lg text-gray-300 mb-8">Join thousands of developers who are improving their skills and acing technical interviews.</p>
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/interview" 
                onClick={startNewSession}
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all group"
              >
                Begin Interview Practice
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section> */}
      
      {/* Footer */}
      {/* <footer className="py-8 border-t border-gray-800 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Interactive Code Editor. All rights reserved.</p>
      </footer> */}
    </main>
  );
};

export default Page;