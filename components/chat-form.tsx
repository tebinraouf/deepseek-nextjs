"use client"

import { cn } from "@/lib/utils"
import { useChat, type Message } from "ai/react"
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import type React from "react"
import { useMemo } from "react"
import ReactMarkdown from "react-markdown"

interface ProcessedMessage extends Message {
  thinking?: string
  response?: string
}

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const { messages, input, setInput, append, isLoading } = useChat({
    api: "/api/chat",
  })

  const processedMessages = useMemo(() => {
    return messages.map((message) => {
      if (message.role === "assistant") {
        // Check if the message starts with a thinking tag
        const hasThinkingTag = message.content.startsWith('<think>')
        const thinkMatch = message.content.match(/<think>([\s\S]*?)<\/think>/)
        
        // If there's a thinking tag but no response yet, show only thinking
        if (hasThinkingTag && !message.content.includes('</think>')) {
          return {
            ...message,
            thinking: message.content.replace('<think>', ''),
            response: ''
          }
        }
        
        // Otherwise process normally
        const thinking = thinkMatch ? thinkMatch[1].trim() : ""
        const response = message.content.replace(/<think>[\s\S]*?<\/think>/, "").trim()
        return { ...message, thinking, response }
      }
      return message
    })
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void append({ content: input, role: "user" })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const header = useMemo(
    () => (
      <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">DeepSeek AI Chatbot Template</h1>
        <p className="text-muted-foreground text-sm">
          This is an AI chatbot app template built with <span className="text-foreground">Next.js</span>, the{" "}
          <span className="text-foreground">Vercel AI SDK</span>, and{" "}
          <span className="text-foreground">DeepSeek R1 Distill LLaMA 70B</span> via Groq.
        </p>
        <p className="text-muted-foreground text-sm">Send a message to start chatting with the AI assistant.</p>
      </header>
    ),
    [],
  )

  const messageList = useMemo(
    () => (
      <div className="my-4 flex h-fit min-h-full flex-col gap-4">
        {processedMessages.map((message, index) => {
          if (message.role === "assistant") {
            return (
              <div key={index} className="max-w-[80%] self-start">
                <div className="min-h-[60px]">
                  {message.thinking && (
                    <div className="mb-2 pl-1">
                      <div className="border-l-2 border-gray-200 pl-3">
                        <div className="prose-xs prose max-w-none text-[11px] text-gray-400 italic">
                          <ReactMarkdown>{message.thinking}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                  {message.response && (
                    <div className="rounded-xl bg-gray-100 px-3 py-2 text-sm text-black">
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{message.response}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          return (
            <div
              key={index}
              data-role={message.role}
              className="max-w-[80%] self-end rounded-xl bg-blue-500 px-3 py-2 text-sm text-white"
            >
              {message.content}
            </div>
          )
        })}
        {isLoading && (
          <div className="max-w-[80%] self-start">
            <div className="mb-2 pl-1">
              <div className="border-l-2 border-gray-200 pl-3">
                <div className="h-0.5 w-6 animate-pulse rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    ),
    [processedMessages, isLoading],
  )

  return (
    <TooltipProvider>
      <main
        className={cn(
          "ring-none mx-auto flex h-svh max-h-svh w-full max-w-[35rem] flex-col items-stretch border-none",
          className,
        )}
        {...props}
      >
        <div className="flex-1 content-center overflow-y-auto px-6">
          {processedMessages.length ? messageList : header}
        </div>
        <form
          onSubmit={handleSubmit}
          className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={(v) => setInput(v)}
            value={input}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="absolute bottom-1 right-1 size-6 rounded-full">
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </form>
      </main>
    </TooltipProvider>
  )
}

