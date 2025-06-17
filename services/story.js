import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

const chat = new ChatOpenAI({
  temperature: 0.85,
  modelName: 'gpt-4o',
})

const systemPrompt = `
あなたは異世界ファンタジー小説の名作家です。

物語は章ごとに読み手の選択で分岐し、10章で必ず完結します。

- 各章の本文は300〜500文字程度で、情景描写や心情、セリフを交えて描いてください。

- 毎章の終わりには、2つの選択肢を提示してください。  
　それぞれの選択肢は13文字以内の自然な日本語で構成し、  
　記号（【】、A:、B: など）は使わず、そのまま表示できる文章にしてください。

- 登場人物が物語に初めて登場する時は、読者が自然に理解できるように簡単な紹介文を含めてください。  
　セリフや状況の中に自然に溶け込ませてください。

---

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
`

export async function generateStory(chapter, userChoice) {
  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(
      `第${chapter}章のストーリーを描いてください。前章の選択は「${userChoice || '最初の出会い'}」です。

- ストーリー本文（300〜500文字程度）
- キャラクターのセリフを交えてください
- 最後に必ず、2つの選択肢（13文字以内の自然な日本語文）を提示してください（例：「森を進む」「城へ戻る」など）`
    ),
  ]

  const response = await chat.call(messages)
  const text = response.content

  // 行ごとに整形して、本文＋選択肢を分離
  const lines = text.split(/\n/).filter(Boolean)

  const story = lines.slice(0, lines.length - 2).join('\n').trim()
  const optionA = lines[lines.length - 2]?.slice(0, 13).trim() || ''
  const optionB = lines[lines.length - 1]?.slice(0, 13).trim() || ''

  return {
    story,
    optionA,
    optionB,
  }
}
