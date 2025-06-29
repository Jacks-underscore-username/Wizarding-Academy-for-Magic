const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'))
import colorScheme from '../config.js'
import rawRunesModule from '../runes.js'
const size = window.innerWidth / 10
const padding = 25
const runesModule = rawRunesModule(canvas, ctx, size, padding, colorScheme)

let index = 0
let front = false

const nameElement = /** @type {HTMLDivElement} */ (document.getElementById('set_name'))

/**
 * @param {number} index
 */
const updateRunes = index => {
  runesModule.drawRuneImages(runesModule.runes[index][1], front)
  nameElement.textContent = `${runesModule.runes[index][0]} ${front ? 'Front' : 'Back'}`
}
updateRunes(index)

document.getElementById('prev_button')?.addEventListener('click', () => {
  index = (index + runesModule.runes.length - 1) % runesModule.runes.length
  updateRunes(index)
})

document.getElementById('next_button')?.addEventListener('click', () => {
  index = (index + runesModule.runes.length + 1) % runesModule.runes.length
  updateRunes(index)
})

document
  .getElementById('download_button')
  ?.addEventListener('click', () =>
    runesModule.downloadCanvas(`${runesModule.runes[index][0]} Rune Sheet ${front ? 'Front' : 'Back'}.png`)
  )

let isDownloading = false

document.getElementById('download_all_button')?.addEventListener('click', async () => {
  if (isDownloading) return
  isDownloading = true
  for (let index = 0; index < runesModule.runes.length; index++) {
    updateRunes(index)
    runesModule.downloadCanvas(`${runesModule.runes[index][0]} Rune Sheet ${front ? 'Front' : 'Back'}.png`)
    await new Promise(r => setTimeout(r, 100))
  }
  updateRunes(index)
  isDownloading = false
})

document.getElementById('toggle_side_button')?.addEventListener('click', () => {
  front = !front
  updateRunes(index)
})
