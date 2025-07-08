const fs = require('node:fs')
const path = require('node:path')
const Canvas = require('canvas')

Canvas.registerFont('PirataOne-Regular.ttf', { family: 'Pirata One' })

process.chdir(path.join(__dirname, 'assets'))

import rawSpellsModule from './spells.js'
import rawRunesModule from './runes.js'
import colorScheme from './config.js'

/**
 * @param {'spells' | 'runes'} mode
 * @param {boolean} front
 * @param {boolean} bulk
 * @param {boolean} flip
 * @param {number} index
 * @returns {Promise<string>}
 */
const generateAsset = async (mode, front, bulk, flip, index) =>
  new Promise(resolve => {
    const canvas = Canvas.createCanvas(100, 100)
    const ctx = canvas.getContext('2d')

    const spellsModule = rawSpellsModule(canvas, ctx, 100, colorScheme, fs)
    const runesModule = rawRunesModule(canvas, ctx, 100, 25, colorScheme)

    if (mode === 'spells') {
      /** @type {import('./spells.js').spell[]} */
      const spellSet = bulk
        ? spellsModule.spells.flatMap(set => set[1]).slice(index * 70, index * 70 + 70)
        : spellsModule.spells[index][1]
      spellsModule.drawSpellImages(spellSet, front, flip)
      const name = bulk
        ? `Bulk Spell Sheet (${index + 1}/${Math.ceil(spellsModule.totalSpellCount / 70)}) ${front ? 'Front' : 'Back'}`
        : `${spellsModule.spells[index][0]} Spell Sheet ${front ? 'Front' : 'Back'}`
      const fileName = `${name.replaceAll('/', '_')}.png`
      if (!fs.existsSync(path.dirname(fileName))) fs.mkdirSync(path.dirname(fileName), { recursive: true })
      fs.writeFileSync(fileName, '')
      const out = fs.createWriteStream(fileName)
      const stream = canvas.createPNGStream()
      stream.pipe(out)
      out.on('finish', () => resolve(name))
    } else {
      /** @type {import('./runes.js').rune[]} */
      const runeSet = bulk
        ? runesModule.runes.flatMap(set => set[1]).slice(index * 70, index * 70 + 70)
        : runesModule.runes[index][1]
      runesModule.drawRuneImages(runeSet, front, flip)
      const name = bulk
        ? `Bulk Rune Sheet (${index + 1}/${Math.ceil(runesModule.totalRuneCount / 70)}) ${front ? 'Front' : 'Back'}`
        : `${runesModule.runes[index][0]} Rune Sheet ${front ? 'Front' : 'Back'}`
      const fileName = `${name.replaceAll('/', '_')}.png`
      if (!fs.existsSync(path.dirname(fileName))) fs.mkdirSync(path.dirname(fileName), { recursive: true })
      fs.writeFileSync(fileName, '')
      const out = fs.createWriteStream(fileName)
      const stream = canvas.createPNGStream()
      stream.pipe(out)
      out.on('finish', () => resolve(name))
    }
  })
;(async () => {
  const [spellSetCount, totalSpellCount, runeSetCount, totalRuneCount] = (() => {
    const canvas = Canvas.createCanvas(1000, 1000)
    const ctx = canvas.getContext('2d')

    const spellsModule = rawSpellsModule(canvas, ctx, 100, colorScheme, fs)
    const runesModule = rawRunesModule(canvas, ctx, 100, 10, colorScheme)

    return [
      spellsModule.spells.length,
      spellsModule.totalSpellCount,
      runesModule.runes.length,
      runesModule.totalRuneCount
    ]
  })()

  for (const file of fs.readdirSync('./')) fs.rmSync(path.join('./', file))
  for (const mode of /** @type {('spells' | 'runes')[]} */ (['spells', 'runes']))
    for (const front of [true, false])
      for (const bulk of [true, false])
        for (const index of new Array(
          Math.ceil(
            mode === 'spells'
              ? bulk
                ? totalSpellCount / 70
                : spellSetCount
              : bulk
                ? totalRuneCount / 70
                : runeSetCount
          )
        )
          .fill(0)
          .map((v, index) => index))
          console.log(`Generated ${await generateAsset(mode, front, bulk, false, index)}`)
})()
