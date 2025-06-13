import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import dotenv from 'dotenv'
dotenv.config()

const serviceAccount = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON, 'base64').toString('utf-8')
)

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID)
const auth = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

// ✅ ここが修正ポイント
async function loadSheet() {
  await doc.useServiceAccountAuth({
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  })
  await doc.loadInfo()
  const sheet = doc.sheetsByTitle['users'] || await doc.addSheet({
    title: 'users',
    headerValues: ['userId', 'chapter', 'history']
  })
  return sheet
}

export async function getUserData(userId) {
  const sheet = await loadSheet()
  const rows = await sheet.getRows()
  const row = rows.find((r) => r.userId === userId)
  if (!row) return null
  return {
    chapter: parseInt(row.chapter),
    history: JSON.parse(row.history || '[]'),
  }
}

export async function saveUserData(userId, data) {
  const sheet = await loadSheet()
  const rows = await sheet.getRows()
  const row = rows.find((r) => r.userId === userId)

  if (row) {
    row.chapter = data.chapter
    row.history = JSON.stringify(data.history)
    await row.save()
  } else {
    await sheet.addRow({
      userId,
      chapter: data.chapter,
      history: JSON.stringify(data.history),
    })
  }
}
