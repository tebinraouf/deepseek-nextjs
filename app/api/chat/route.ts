import { type CoreMessage, streamText } from "ai"
import { createDeepSeek } from "@ai-sdk/deepseek"

// Create a custom DeepSeek instance with the provided base URL
const deepseek = createDeepSeek({
  baseURL: process.env.DEEPSEEK_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
})

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const result = streamText({
    model: deepseek("deepseek-r1-distill-llama-70b"),
    messages,
    system:
      "You are a helpful AI assistant. Before providing an answer, think through your response and wrap your thinking process in <think> tags. Then provide your final answer after the closing </think> tag.",
  })

  return result.toDataStreamResponse()
}

