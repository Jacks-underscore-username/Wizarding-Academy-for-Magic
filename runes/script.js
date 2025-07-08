const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'))
import colorScheme from '../config.js'
import rawRunesModule from '../runes.js'
const size = window.innerWidth / 11
const padding = 25
const runesModule = rawRunesModule(canvas, ctx, size, padding, colorScheme)

let index = 0
let front = true
let bulk = false
let flip = false

const maxPageSize = 70

const nameElement = /** @type {HTMLDivElement} */ (document.getElementById('set_name'))

/**
 * @param {number} index
 * @returns {string}
 */
const getName = index => {
  if (bulk)
    return `Bulk Rune Sheet (${index + 1}/${Math.ceil(runesModule.totalRuneCount / maxPageSize)}) ${front ? 'Front' : 'Back'}`
  return `${runesModule.runes[index][0]} Rune Sheet ${front ? 'Front' : 'Back'}`
}

/**
 * @param {number} index
 * @returns {import('../runes.js').rune[]}
 */
const getRuneSet = index =>
  bulk
    ? runesModule.runes.flatMap(set => set[1]).slice(index * maxPageSize, index * maxPageSize + maxPageSize)
    : runesModule.runes[index][1]

/**
 * @param {number} index
 */
const updateRunes = index => {
  runesModule.drawRuneImages(getRuneSet(index), front, flip)
  nameElement.textContent = getName(index)
}
updateRunes(index)

document.getElementById('prev_button')?.addEventListener('click', () => {
  if (bulk)
    index =
      (index + Math.ceil(runesModule.totalRuneCount / maxPageSize) - 1) %
      Math.ceil(runesModule.totalRuneCount / maxPageSize)
  else index = (index + runesModule.runes.length - 1) % runesModule.runes.length
  updateRunes(index)
})

document.getElementById('next_button')?.addEventListener('click', () => {
  if (bulk)
    index =
      (index + Math.ceil(runesModule.totalRuneCount / maxPageSize) + 1) %
      Math.ceil(runesModule.totalRuneCount / maxPageSize)
  else index = (index + runesModule.runes.length + 1) % runesModule.runes.length
  updateRunes(index)
})

document
  .getElementById('download_button')
  ?.addEventListener('click', () => runesModule.downloadCanvas(`${getName(index)}.png`))

let isDownloading = false

document.getElementById('download_all_button')?.addEventListener('click', async () => {
  if (isDownloading) return
  isDownloading = true
  for (
    let index = 0;
    index < (bulk ? Math.ceil(runesModule.totalRuneCount / maxPageSize) : runesModule.runes.length);
    index++
  ) {
    updateRunes(index)
    runesModule.downloadCanvas(`${getName(index)}.png`)
    await new Promise(r => setTimeout(r, 100))
  }
  updateRunes(index)
  isDownloading = false
})

document.getElementById('toggle_side_button')?.addEventListener('click', () => {
  front = !front
  updateRunes(index)
})

document.getElementById('toggle_bulk_button')?.addEventListener('click', () => {
  bulk = !bulk
  index = 0
  updateRunes(index)
})

document.getElementById('flip_button')?.addEventListener('click', () => {
  flip = !flip
  updateRunes(index)
})
