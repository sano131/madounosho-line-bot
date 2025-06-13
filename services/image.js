import { OpenAI } from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateImage(storyText) {
  const basePrompt = `
An anime-style fantasy illustration. Cinematic, soft glow, rich details.

Story context: "${storyText?.slice(0, 600) || 'a fantasy story illustration'}"
`

  const response = await openai.images.generate({
    prompt: basePrompt,
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  })

  return response.data[0].url
}
