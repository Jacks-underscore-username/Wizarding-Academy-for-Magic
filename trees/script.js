const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'))
import colorScheme from '../config.js'
import rawRunesModule from '../runes.js'
const size = window.innerWidth / 15
const padding = 25
const runesModule = rawRunesModule(canvas, ctx, size, padding, colorScheme)

let index = 0

const nameElement = /** @type {HTMLDivElement} */ (document.getElementById('set_name'))

/**
 * @param {number} index
 */
const updateTree = index => {
  runesModule.drawRuneTree(runesModule.runes[index][1])
  nameElement.textContent = runesModule.runes[index][0]
}
updateTree(index)

document.getElementById('prev_button')?.addEventListener('click', () => {
  index = (index + runesModule.runes.length - 1) % runesModule.runes.length
  updateTree(index)
})

document.getElementById('next_button')?.addEventListener('click', () => {
  index = (index + runesModule.runes.length + 1) % runesModule.runes.length
  updateTree(index)
})

document
  .getElementById('download_button')
  ?.addEventListener('click', () => runesModule.downloadCanvas(`${runesModule.runes[index][0]} Rune Tree.png`))

let isDownloading = false

document.getElementById('download_all_button')?.addEventListener('click', async () => {
  if (isDownloading) return
  isDownloading = true
  for (let index = 0; index < runesModule.runes.length; index++) {
    updateTree(index)
    runesModule.downloadCanvas(`${runesModule.runes[index][0]} Rune Tree.png`)
    await new Promise(r => setTimeout(r, 100))
  }
  updateTree(index)
  isDownloading = false
})
