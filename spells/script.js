const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'))
import colorScheme from '../config.js'
import rawSpellsModule from '../spells.js'
const size = window.innerWidth / 10
const spellsModule = rawSpellsModule(canvas, ctx, size, colorScheme)

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
    return `Bulk Spell Sheet (${index + 1}/${Math.ceil(spellsModule.totalSpellCount / maxPageSize)}) ${front ? 'Front' : 'Back'}`
  return `${spellsModule.spells[index][0]} Spell Sheet ${front ? 'Front' : 'Back'}`
}

/**
 * @param {number} index
 * @returns {import('../spells.js').spell[]}
 */
const getSpellSet = index =>
  bulk
    ? spellsModule.spells.flatMap(set => set[1]).slice(index * maxPageSize, index * maxPageSize + maxPageSize)
    : spellsModule.spells[index][1]

/**
 * @param {number} index
 */
const updateSpells = index => {
  spellsModule.drawSpellImages(getSpellSet(index), front, flip)
  nameElement.textContent = getName(index)
}
updateSpells(index)

document.getElementById('prev_button')?.addEventListener('click', () => {
  if (bulk)
    index =
      (index + Math.ceil(spellsModule.totalSpellCount / maxPageSize) - 1) %
      Math.ceil(spellsModule.totalSpellCount / maxPageSize)
  else index = (index + spellsModule.spells.length - 1) % spellsModule.spells.length
  updateSpells(index)
})

document.getElementById('next_button')?.addEventListener('click', () => {
  if (bulk)
    index =
      (index + Math.ceil(spellsModule.totalSpellCount / maxPageSize) + 1) %
      Math.ceil(spellsModule.totalSpellCount / maxPageSize)
  else index = (index + spellsModule.spells.length + 1) % spellsModule.spells.length
  updateSpells(index)
})

document
  .getElementById('download_button')
  ?.addEventListener('click', () => spellsModule.downloadCanvas(`${getName(index)}.png`))

let isDownloading = false

document.getElementById('download_all_button')?.addEventListener('click', async () => {
  if (isDownloading) return
  isDownloading = true
  for (
    let index = 0;
    index < (bulk ? Math.ceil(spellsModule.totalSpellCount / maxPageSize) : spellsModule.spells.length);
    index++
  ) {
    updateSpells(index)
    spellsModule.downloadCanvas(`${getName(index)}.png`)
    await new Promise(r => setTimeout(r, 100))
  }
  updateSpells(index)
  isDownloading = false
})

document.getElementById('toggle_side_button')?.addEventListener('click', () => {
  front = !front
  updateSpells(index)
})

document.getElementById('toggle_bulk_button')?.addEventListener('click', () => {
  bulk = !bulk
  index = 0
  updateSpells(index)
})

document.getElementById('flip_button')?.addEventListener('click', () => {
  flip = !flip
  updateSpells(index)
})
