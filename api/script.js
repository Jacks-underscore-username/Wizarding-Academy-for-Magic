const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'))
import colorScheme from '../config.js'
import rawSpellsModule from '../spells.js'
import rawRunesModule from '../runes.js'
const size = window.innerWidth / 10
const padding = 25
const spellsModule = rawSpellsModule(canvas, ctx, size, colorScheme)
const runesModule = rawRunesModule(canvas, ctx, size, padding, colorScheme)

const searchParams = new URLSearchParams(window.location.search)

/**
 * @template T
 * @param {string} key
 * @param {Array<T>} values
 * @returns {T}
 */
const parseOption = (key, values) => {
  if (searchParams.has(key)) {
    const value = searchParams.get(key)
    // @ts-expect-error
    if (values.includes(value)) return value
  }
  // @ts-expect-error
  searchParams.set(key, values[0])
  window.location.search = searchParams.toString()
  throw new Error('No value set')
}

/** @type {'spells' | 'runes'} */
const mode = parseOption('mode', ['spells', 'runes'])

/** @type {boolean} */
const front = parseOption('front', ['no', 'yes']) === 'yes'

/** @type {boolean} */
const bulk = parseOption('bulk', ['no', 'yes']) === 'yes'

/** @type {boolean} */
const flip = parseOption('flip', ['no', 'yes']) === 'yes'

/** @type {number} */
const index =
  Number.parseInt(
    parseOption(
      'index',
      new Array(
        Math.ceil(
          mode === 'spells'
            ? bulk
              ? spellsModule.totalSpellCount / 70
              : spellsModule.spells.length
            : bulk
              ? runesModule.totalRuneCount / 70
              : runesModule.runes.length
        )
      )
        .fill(0)
        .map((v, index) => `${index + 1}`)
    )
  ) - 1

if (mode === 'spells') {
  /** @type {import('../spells.js').spell[]} */
  const spellSet = bulk
    ? spellsModule.spells.flatMap(set => set[1]).slice(index * 70, index * 70 + 70)
    : spellsModule.spells[index][1]
  spellsModule.drawSpellImages(spellSet, front, flip)
  const name = bulk
    ? `Bulk Spell Sheet (${index + 1}/${Math.ceil(spellsModule.totalSpellCount / 70)}) ${front ? 'Front' : 'Back'}`
    : `${spellsModule.spells[index][0]} Spell Sheet ${front ? 'Front' : 'Back'}`
  canvas.addEventListener('click', () => spellsModule.downloadCanvas(`${name}.png`))
} else {
  /** @type {import('../runes.js').rune[]} */
  const runeSet = bulk
    ? runesModule.runes.flatMap(set => set[1]).slice(index * 70, index * 70 + 70)
    : runesModule.runes[index][1]
  runesModule.drawRuneImages(runeSet, front, flip)
  const name = bulk
    ? `Bulk Rune Sheet (${index + 1}/${Math.ceil(runesModule.totalRuneCount / 70)}) ${front ? 'Front' : 'Back'}`
    : `${runesModule.runes[index][0]} Rune Sheet ${front ? 'Front' : 'Back'}`
  canvas.addEventListener('click', () => runesModule.downloadCanvas(`${name}.png`))
}
