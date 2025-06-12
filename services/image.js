import { OpenAI } from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateImage(storyText) {
  const basePrompt = `
An anime-style fantasy illustration set in the magical world of "Eldina Arc".
Include soft glowing light, dramatic fantasy landscapes, ancient ruins or enchanted forests, and mystical atmosphere.

Characters may include:
- 👑 Lucia Elphine: a silver-haired elf queen in elegant robes
- ⚔️ Noa Valhalt: a serious female knight in black armor with a long sword
- 🌸 Fine: a small floating fairy with pink hair and glowing wings

Use highly detailed backgrounds and cinematic lighting. The scene should visually represent the emotional tone of the chapter and the setting described.

Story context:
"${storyText}"
  `

  const response = await openai.images.generate({
    prompt: basePrompt,
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  })

  return response.data[0].url
}
