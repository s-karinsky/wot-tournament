export default function censor(text, replace = []) {
  if (!replace.length) return text
  const textByWords = text.split(' ')
  return textByWords.reduce((res, word) => {
    const censor = replace.find(item => item.findWords.includes(word))
    const newWord = censor ? censor.replaceWith : word
    return res ? [res, newWord].join(' ') : newWord
  }, '')
}
