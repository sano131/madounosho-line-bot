import express from 'express'
import { middleware, Client } from '@line/bot-sdk'
import dotenv from 'dotenv'
import { generateStory } from './services/story.js'
import { generateImage } from './services/image.js'
import { createFlexMessage } from './utils/flexTemplate.js'
import { getUserData, saveUserData } from './services/sheets.js'

dotenv.config()

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
}

const client = new Client(config)
const app = express()

// ✅ Webhookのbodyパースを有効にする（超重要！）
app.use(express.json())

// ✅ Webhookエンドポイント
app.post('/webhook', middleware(config), async (req, res) => {
  const events = req.body.events
  const results = await Promise.all(events.map(handleEvent))
  res.json(results)
})

// ✅ イベントハンドラー
async function handleEvent(event) {
  console.log('🔥 Event received:', JSON.stringify(event, null, 2)) // 任意のデバッグログ

  if (event.type !== 'message' && event.type !== 'postback') return null

  const userId = event.source.userId
  let userData = await getUserData(userId)

  if (!userData) {
    userData = { chapter: 1, history: [] }
  }

  let userChoice = ''
  if (event.type === 'postback') {
    userChoice = event.postback.data
    userData.chapter += 1
  }

  const isFinalChapter = userData.chapter >= 10

  const { story, optionA, optionB } = await generateStory(userData.chapter, userChoice)

  const imageUrl = await generateImage(story)

  userData.history.push({ chapter: userData.chapter, choice: userChoice, story })

  await saveUserData(userId, userData)

  const message = createFlexMessage(
    story,
    imageUrl,
    isFinalChapter ? null : optionA,
    isFinalChapter ? null : optionB
  )

  return client.replyMessage(event.replyToken, message)
}

// ✅ ポート起動
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`魔導ノ書 Bot is running on port ${PORT}`)
})
