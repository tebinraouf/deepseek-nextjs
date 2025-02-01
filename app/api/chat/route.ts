import { type CoreMessage, streamText } from "ai"
import { createDeepSeek } from "@ai-sdk/deepseek"

// Create a custom DeepSeek instance with the provided base URL
const deepseek = createDeepSeek({
  baseURL: process.env.DEEPSEEK_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Validate request body
    const { messages }: { messages: CoreMessage[] } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 })
    }

    // Validate environment variables
    if (!process.env.DEEPSEEK_BASE_URL || !process.env.DEEPSEEK_API_KEY) {
      console.error("Missing DeepSeek configuration")
      return new Response("Server configuration error", { status: 500 })
    }

    const result = streamText({
      model: deepseek("deepseek-r1-distill-llama-70b"),
      messages,
      system:
        "You are a helpful AI assistant. Before providing an answer, think through your response and wrap your thinking process in <think> tags. Then provide your final answer after the closing </think> tag.",
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}

