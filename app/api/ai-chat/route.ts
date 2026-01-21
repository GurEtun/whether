import { streamText, convertToModelMessages, UIMessage } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, marketContext }: { messages: UIMessage[]; marketContext: string } = await req.json()

  const systemPrompt = `You are an AI market analyst assistant for a prediction market platform called Whether. 
Your role is to help users understand and analyze prediction markets.

Current Market Context:
${marketContext}

Guidelines:
- Provide objective, data-driven analysis
- Explain market dynamics and probability implications
- Help users understand what factors might influence outcomes
- Cite reasoning and logic clearly
- Be concise but thorough
- Never provide financial advice or guarantees about outcomes
- Encourage users to do their own research`

  const prompt = convertToModelMessages([
    {
      role: 'system',
      content: [{ type: 'text', text: systemPrompt }],
      id: 'system',
      parts: [],
    },
    ...messages,
  ])

  const result = streamText({
    model: 'openai/gpt-5-mini',
    prompt,
    abortSignal: req.signal,
    maxOutputTokens: 1000,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
