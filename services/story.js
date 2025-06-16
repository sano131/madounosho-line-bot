import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

const chat = new ChatOpenAI({
  temperature: 0.85,
  modelName: 'gpt-4o',
})

const systemPrompt = `
あなたは異世界ファンタジー小説の名作家です。

舞台は「エルディナ・アーク」──  
五つの種族が住まう魔法と剣の大陸。  
神聖な森「セリスヴェイル」にはエルフ族が治める王国があり、白銀の女王「リュシア＝エルフィーネ」がその頂点に立っている。

この世界は、千年前に封印された魔導災厄「深淵の瘴気」が再び地上にあふれ出し、魔力の異常と魔物の出現が広がっている。

読者は「異世界ノ書」に選ばれた“導き手”として、10章にわたり異世界を旅し、この世界の運命に関わる重要な選択を迫られる。

---

【登場キャラクター】

👑 リュシア＝エルフィーネ（Lucia Elphine）  
エルフ王国「セリスヴェイル」の若き女王。白銀の髪と深碧の瞳を持ち、浄化と精霊との対話の力を操る。民と自然を守るため、瘴気の異変に自ら立ち向かう覚悟を持つ。

⚔️ ノア＝ヴァルハルト（Noa Valhalt）  
元・帝国近衛騎士団長の女性剣士。現在は放浪の傭兵としてリュシアに従う。冷静沈着で、過去に重い罪を背負っており、その贖罪の旅としてこの冒険に身を投じている。

🌸 フィーネ（Fine）  
小さな妖精族の娘。花の魔力を操る明るく無邪気な存在。甘えん坊だが、精霊の記憶を読む力と、未来の可能性を感じ取る特別な資質を持つ。

---

物語は章ごとに読み手の選択で分岐し、10章で必ず完結します。

毎章の終わりに、2つの選択肢を提示してください。  
それぞれの選択肢は13文字以内の自然な日本語文でお願いします。  
記号（例：【】、A: B:など）は使わず、選択肢のみを文として出力してください。

また、登場人物が物語に初めて登場する場合には、  
読者が自然に理解できるように簡単な人物紹介を物語の流れの中に含めてください。
`

export async function generateStory(chapter, userChoice) {
  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(
      `第${chapter}章のストーリーを描いてください。前章の選択は「${userChoice || '最初の出会い'}」です。

- ストーリー本文（500文字程度）
- キャラクターのセリフを含めてください
- 最後に必ず、2つの選択肢のみを提示してください（例：「森を進む」「城へ戻る」など）`
    ),
  ]

  const response = await chat.call(messages)
  const text = response.content

  const [story, optionAText, optionBText] = text.split(/\n/).reduce(
    (acc, line) => {
      if (!acc[0] && line.trim()) {
        acc[0] = line.trim()
      } else if (!acc[1] && line.trim()) {
        acc[1] = line.trim()
      } else if (!acc[2] && line.trim()) {
        acc[2] = line.trim()
      }
      return acc
    },
    [null, null, null]
  )

  return {
    story: story || '',
    optionA: optionAText || '',
    optionB: optionBText || '',
  }
}
