import { N } from './namhai'

export function doubleSpan(element) {
  const node = element
  node.innerHTML = `<span class='preloader__text__animation'>${node.innerHTML}</span>`
  return N.get('span', node)
}

export function split({ element, expression = ' ', append = true }) {
  const words = splitText(element.innerHTML.toString().trim(), expression)

  let innerHTML = ''

  for (const line of words) {
    if (line.indexOf('<br>') > -1) {
      const lines = line.split('<br>')

      for (const [index, line] of lines.entries()) {
        innerHTML += (index > 0) ? '<br>' + parseLine(line) : parseLine(line)
      }
    } else {
      innerHTML += parseLine(line)
    }
  }

  element.innerHTML = innerHTML

  const spans = N.get('span', element)

  if (append) {
    for (const span of spans) {
      const isSingleLetter = span.textContent.length === 1,
        isNotEmpty = span.innerHTML.trim() !== '',
        isNotAndCharacter = span.textContent !== '&',
        isNotDashCharacter = span.textContent !== '-'

      if (isSingleLetter && isNotEmpty && isNotAndCharacter && isNotDashCharacter) {
        span.innerHTML = `${span.textContent}&nbsp`
      }
    }
  }
  return spans
}

export function calculate(spans) {
  const lines = []
  let words = []

  let position = spans[0].offsetTop

  for (const span of spans) {
    if (span.offsetTop === position) words.push(span)
    else {
      lines.push(words)
      words = []
      words.push(span)
      position = span.offsetTop
    }

    if (index + 1 === spans.length) lines.push(words)
  }
  return lines
}


function splitText(text, expression) {
  const splits = text.split('<br>')
  let words = []
  for (const [index, item] of splits.entries()) {
    if (index > 0) words.push('<br>')

    words = words.concat(item.split(expression))
    let isLink = false
    let link = ''

    const innerHTML = []

    for (const word of words) {
      if (!isLink && (word.includes('<a') || word.includes('<strong'))) {
        link = ''
        isLink = true
      }
      if (isLink) link += ` ${word}`
      if (isLink && (word.includes('/a>') || word.includes('/strong>'))) {
        innerHTML.push(link)
        link = ''
      }
      if (!isLink && link === '') innerHTML.push(word)
      if (isLink && (word.includes('/a>') || word.includes('/strong>'))) isLink = false

    }
    words = innerHTML
  }

  return words
}

function parseLine(line) {
  line = line.trim()

  return (line === '' || line === ' ') ? line : line == '<br>' ? '<br>' : `<span>${line}</span>` + ((line.length > 1) ? ' ' : '')
}
