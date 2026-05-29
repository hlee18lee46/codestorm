"use client"

import { useState } from "react"
import { Send, Sparkles, HelpCircle, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  role: "user" | "ai"
  content: string
}

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

const sampleQuiz: QuizQuestion = {
  question: "What is the time complexity of binary search?",
  options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
  correctIndex: 1
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "What is a binary search tree?" },
    { role: "ai", content: "A Binary Search Tree (BST) is a data structure where each node has at most two children. The left subtree contains only nodes with values less than the parent, and the right subtree contains only nodes with values greater than the parent. This property enables efficient searching with O(log n) average time complexity." }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = input
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setMessages(prev => [...prev, { 
      role: "ai", 
      content: `Great question about "${userMessage}"! This is a simulated response from the AI tutor. In a real implementation, this would connect to DigitalOcean Gradient AI for intelligent responses, while Backboard.io would help retain context from previous study sessions.`
    }])
    setIsLoading(false)
  }

  const handleQuiz = () => {
    setShowQuiz(true)
    setSelectedAnswer(null)
    setIsAnswered(false)
  }

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
    setIsAnswered(true)
  }

  return (
    <div className="glass rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-semibold">AI Study Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px]">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-4 ${
                message.role === "user"
                  ? "bg-primary/20 text-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              {message.role === "ai" && (
                <div className="flex items-center gap-2 mb-2 text-xs text-accent">
                  <Sparkles className="w-3 h-3" />
                  AI Tutor
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        {showQuiz && (
          <div className="bg-secondary rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs text-accent">
              <HelpCircle className="w-3 h-3" />
              Quiz Time
            </div>
            <p className="font-medium">{sampleQuiz.question}</p>
            <div className="space-y-2">
              {sampleQuiz.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(i)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                    isAnswered
                      ? i === sampleQuiz.correctIndex
                        ? "bg-accent/20 border border-accent"
                        : i === selectedAnswer
                        ? "bg-destructive/20 border border-destructive"
                        : "bg-muted"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {option}
                    {isAnswered && i === sampleQuiz.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    )}
                    {isAnswered && i === selectedAnswer && i !== sampleQuiz.correctIndex && (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                  </span>
                </button>
              ))}
            </div>
            {isAnswered && (
              <p className={`text-sm ${selectedAnswer === sampleQuiz.correctIndex ? "text-accent" : "text-destructive"}`}>
                {selectedAnswer === sampleQuiz.correctIndex 
                  ? "Correct! Binary search has O(log n) time complexity." 
                  : "Not quite! The correct answer is O(log n)."}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything..."
          className="flex-1 bg-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={handleSend} disabled={isLoading} className="bg-primary hover:bg-primary/80">
          <Send className="w-4 h-4" />
        </Button>
        <Button onClick={handleQuiz} variant="outline" className="border-accent text-accent hover:bg-accent/10">
          <HelpCircle className="w-4 h-4 mr-2" />
          Quiz Me
        </Button>
      </div>
    </div>
  )
}
