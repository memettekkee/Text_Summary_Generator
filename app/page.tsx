"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileText, Sparkles, Copy, CheckCheck } from "lucide-react"

export default function TextSummarizer() {
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const handleTextChange = (e: any) => {
    const value = e.target.value
    setText(value)
    setCharCount(value.length)
  }

  const handleSummarize = async () => {
    if (!text.trim()) return
  
    setIsLoading(true)
  
    try {
      const sanitizedText = text
        .replace(/\n/g, ' ') 
        .replace(/"/g, '\'') 
        .replace(/\\/g, '\\\\');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: sanitizedText }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse response dari API
      const data = await response.json();
      
      const generatedSummary = data.data.candidates[0].content.parts[0].text;
  
      setSummary(generatedSummary);
    } catch (error) {
      console.error("Error:", error);
      setSummary('Error generating summary. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const clearAll = () => {
    setText("");
    setSummary("");
    setCharCount(0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-transparent bg-clip-text">
            Text Summary Generator
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Transform your lengthy text into concise summaries powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-200">
                <FileText className="h-5 w-5" /> Input Text
              </h2>
              <span className="text-sm text-slate-400">{charCount} characters</span>
            </div>
            
            <div className="relative">
              <Textarea
                placeholder="Enter your text here to be summarized..."
                className="min-h-[300px] p-4 text-slate-800 border-slate-700 bg-slate-100 focus-visible:ring-sky-500 rounded-xl w-full resize-none"
                value={text}
                onChange={handleTextChange}
              />
              
              {text && (
                <button 
                  onClick={clearAll}
                  className="absolute top-2 right-2 p-1 rounded-md bg-slate-300 text-slate-700 hover:bg-slate-400"
                  title="Clear text"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            
            <Button
              onClick={handleSummarize}
              disabled={isLoading || !text.trim()}
              className="w-full py-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Summary
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-200">
              <Sparkles className="h-5 w-5" /> Summary Result
            </h2>
            
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-xl rounded-xl overflow-hidden min-h-[300px]">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex flex-col justify-center items-center h-[300px] text-slate-400">
                    <Loader2 className="h-10 w-10 animate-spin text-sky-500 mb-3" />
                    <p>Processing your text...</p>
                  </div>
                ) : summary ? (
                  <div className="relative">
                    <div className="p-6 text-slate-200 h-[300px] overflow-y-auto">
                      <p className="leading-relaxed">{summary}</p>
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 p-2 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center h-[300px] text-slate-500">
                    <Sparkles className="h-10 w-10 mb-3 text-slate-600" />
                    <p>Your summary will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {summary && (
              <div className="text-center text-sm text-slate-400">
                AI-generated summaries may not always capture every detail. Review for accuracy.
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="mt-20 text-center text-sm text-slate-500 pb-10">
        <p>Created with Joy by <a href="https://muhammadmet.biz.id/about" target="_blank" className="font-bold hover:underline text-white">Muhammad(memettekkee)</a></p>
      </footer>
    </div>
  )
}