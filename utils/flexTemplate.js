export function createFlexMessage(story, imageUrl, optionA, optionB) {
  const buttons = []

  if (optionA && optionB) {
    buttons.push({
      type: 'button',
      action: {
        type: 'postback',
        label: optionA.slice(0, 13),
        data: optionA,
        displayText: optionA.slice(0, 13),
      },
      style: 'primary',
    })

    buttons.push({
      type: 'button',
      action: {
        type: 'postback',
        label: optionB.slice(0, 13),
        data: optionB,
        displayText: optionB.slice(0, 13),
      },
      style: 'primary',
    })
  }

  return {
    type: 'flex',
    altText: '異世界ノ書：新しい章が届きました📘',
    contents: {
      type: 'bubble',
      size: 'mega',
      hero: {
        type: 'image',
        url: imageUrl,
        size: 'full',
        aspectMode: 'cover',
        aspectRatio: '1:1',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: story,
            wrap: true,
            size: 'sm',
          },
          ...(buttons.length > 0
            ? [
                {
                  type: 'separator',
                  margin: 'md',
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  spacing: 'sm',
                  margin: 'md',
                  contents: buttons,
                },
              ]
            : []),
        ],
      },
    },
  }
}
