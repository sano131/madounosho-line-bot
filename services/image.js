import { OpenAI } from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 各キャラに応じた一貫性あるビジュアルプロンプト
const characterStyles = {
  Lucia: 'a beautiful elf queen with silver hair and green eyes, wearing a flowing white dress, standing in a glowing magical forest, anime style',
  Noa: 'a cool female knight with short black hair and dark armor, standing on a rocky cliff under twilight sky, anime style',
  Fine: 'a tiny cheerful fairy girl with pink twin-tail hair and glowing wings, floating among blooming flowers, anime style',
  default: 'an anime-style fantasy girl in a cute magical world, soft colors, cinematic lighting',
}

export async function generateImage(storyText, character = 'default') {
  const basePrompt = `
Cute anime-style fantasy illustration. Pastel colors, cinematic soft glow, highly detailed, magical world background.

${characterStyles[character] || characterStyles.default}

Story context: "${storyText?.slice(0, 600) || 'a fantasy scene'}"
`

  const response = await openai.images.generate({
    prompt: basePrompt,
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  })

  return response.data[0].url
}
