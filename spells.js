/**
 * @typedef {Object} unit
 * @prop {1|2|3|4|5} tier
 * @prop {string} name
 * @prop {boolean} canPay
 * @prop {boolean} canGain
 * @prop {boolean} canGrant
 * @prop {boolean} canDrain
 * @prop {boolean} canGive
 * @prop {boolean} canTake
 * @prop {number} multiplier
 * @prop {string} payDesc
 * @prop {string} gainDesc
 * @prop {string} grantDesc
 * @prop {string} drainDesc
 * @prop {string} giveDesc
 * @prop {string} takeDesc
 */

/** @typedef {'pay'|'gain'|'grant'|'drain'|'give'|'take'} unitMode */

/**
 * @typedef {Object} rawSpell
 * @prop {string} name
 * @prop {number} tier
 * @prop {string} flavor
 * @prop {{unit: unit, mode: unitMode}} input
 * @prop {{unit: unit, mode: unitMode}} output
 */

/**
 * @typedef {Object} spell
 * @prop {string} name
 * @prop {number} tier
 * @prop {string} flavor
 * @prop {{unit: unit, mode: unitMode, count: number}} input
 * @prop {{unit: unit, mode: unitMode, count: number}} output
 */

export default /**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} size
 * @param {import("./config").colorScheme} colorScheme
 * @returns {Promise<{spells: [String, spell[]][], drawSpellImages: (spellSet: spell[], front?: boolean) => void, downloadCanvas: (name: string) => void, totalSpellCount: number, units: Map<String, unit>}>}
 */
async (canvas, ctx, size, colorScheme) => {
  /** @type {Map<String, unit>} */
  const units = new Map(
    (await (await fetch('../units.md')).text())
      .split('### ')
      .filter(x => x)
      .map(rawUnit => {
        const lines = rawUnit
          .split('\n')
          .filter(x => x)
          .map(x => x.trim())
        const name = (lines.shift() ?? '').match(/^(.*):$/)?.[1] ?? ''
        const tier = /** @type {1|2|3|4|5} */ (
          Number.parseFloat((lines.shift() ?? '').match(/^\* \*\*Tier\*\*: (.*)$/)?.[1] ?? '')
        )
        const canPay = /^\* \*\*Can pay\*\*: yes$/.test(lines.shift() ?? '')
        const canGain = /^\* \*\*Can gain\*\*: yes$/.test(lines.shift() ?? '')
        const canGrant = /^\* \*\*Can grant\*\*: yes$/.test(lines.shift() ?? '')
        const canDrain = /^\* \*\*Can drain\*\*: yes$/.test(lines.shift() ?? '')
        const canGive = /^\* \*\*Can give\*\*: yes$/.test(lines.shift() ?? '')
        const canTake = /^\* \*\*Can take\*\*: yes$/.test(lines.shift() ?? '')
        const multiplier = Number.parseFloat((lines.shift() ?? '').match(/^\* \*\*Multiplier\*\*: (.*)$/)?.[1] ?? '')
        const payDesc = (lines.shift() ?? '').match(/^\* \*\*Pay description\*\*: (.*)$/)?.[1] ?? ''
        const gainDesc = (lines.shift() ?? '').match(/^\* \*\*Gain description\*\*: (.*)$/)?.[1] ?? ''
        const grantDesc = (lines.shift() ?? '').match(/^\* \*\*Grant description\*\*: (.*)$/)?.[1] ?? ''
        const drainDesc = (lines.shift() ?? '').match(/^\* \*\*Drain description\*\*: (.*)$/)?.[1] ?? ''
        const giveDesc = (lines.shift() ?? '').match(/^\* \*\*Give description\*\*: (.*)$/)?.[1] ?? ''
        const takeDesc = (lines.shift() ?? '').match(/^\* \*\*Take description\*\*: (.*)$/)?.[1] ?? ''
        return {
          name,
          tier,
          canPay,
          canGain,
          canGrant,
          canDrain,
          canGive,
          canTake,
          multiplier,
          payDesc,
          gainDesc,
          grantDesc,
          drainDesc,
          giveDesc,
          takeDesc
        }
      })
      .map(unit => [unit.name, unit])
  )

  /**
   * @param {{unit: unit, mode: unitMode, count: number}} x
   * @param {boolean} [capitalize]
   * @returns {string}
   */
  const prettyUnit = (x, capitalize = true) => {
    let str
    const { unit, mode, count } = x
    if (mode === 'pay') str = unit.payDesc
    else if (mode === 'gain') str = unit.gainDesc
    else if (mode === 'grant') str = unit.grantDesc
    else if (mode === 'drain') str = unit.drainDesc
    else if (mode === 'give') str = unit.giveDesc
    else str = unit.takeDesc
    str = str[0].toLowerCase() + str.slice(1)
    str = str.replaceAll('S', count === 1 ? () => '' : c => c.toLowerCase())
    str = str.replaceAll('X', `${count}`)
    if (capitalize) str = str[0].toUpperCase() + str.slice(1)
    return str
  }

  /** @type {Map<String, rawSpell>} */
  const rawSpells = new Map(
    (await (await fetch('../spells.md')).text())
      .split('### ')
      .filter(x => x)
      .map(rawUnit => {
        const lines = rawUnit
          .split('\n')
          .filter(x => x)
          .map(x => x.trim())
        const name = (lines.shift() ?? '').match(/^(.*):$/)?.[1] ?? ''
        const tier = /** @type {1|2|3|4|5} */ (
          Number.parseFloat((lines.shift() ?? '').match(/^\* \*\*Tier\*\*: (.*)$/)?.[1] ?? '')
        )
        const inputName = (lines[0] ?? '').match(/^\* \*\*Input\*\*: \S+ (.*)$/)?.[1] ?? ''
        const inputMode = (lines.shift() ?? '').match(/^\* \*\*Input\*\*: (\S+) .*$/)?.[1] ?? ''
        const outputName = (lines[0] ?? '').match(/^\* \*\*Output\*\*: \S+ (.*)$/)?.[1] ?? ''
        const outputMode = (lines.shift() ?? '').match(/^\* \*\*Output\*\*: (\S+) .*$/)?.[1] ?? ''
        const flavor = (lines.shift() ?? '').match(/^\* \*\*Flavor\*\*: (.*)$/)?.[1] ?? ''
        const inputUnit = units.get(inputName)
        const outputUnit = units.get(outputName)
        if (inputUnit === undefined) throw new Error(`Unknown unit "${inputName}"`)
        if (outputUnit === undefined) throw new Error(`Unknown unit "${outputName}"`)
        return {
          name,
          tier,
          input: { unit: inputUnit, mode: /** @type {unitMode} */ (inputMode.toLowerCase()) },
          output: { unit: outputUnit, mode: /** @type {unitMode} */ (outputMode.toLowerCase()) },
          flavor
        }
      })
      .map(spell => [spell.name, spell])
  )

  /**
   * @param {number} T
   * @param {number} A
   * @param {number} B
   * @returns {number}
   */
  const calculateMult = (T, A, B) => (1 / Math.max(2 * B - A - T, 1)) * Math.max(2 * T - A - B, 1)

  /** @type {[String, spell[]][]} */
  const spells = [
    [
      'Base',
      Array.from(rawSpells.values()).map(rawSpell => {
        const T = rawSpell.tier
        const A = rawSpell.input.unit.tier
        const B = rawSpell.output.unit.tier

        const inputMult = rawSpell.input.mode === 'give' ? 2 : 1
        const outputMult = rawSpell.output.mode === 'take' ? 2 : 1

        const mult = (calculateMult(T, A, B) * inputMult) / outputMult
        let best = 0
        for (let index = 1; index <= 10; index++) {
          if (mult * index === Math.floor(mult * index)) {
            best = index
            break
          }
          if (index === 10) throw new Error('Uh oh')
        }

        /** @type {spell} */
        const spell = {
          name: rawSpell.name,
          tier: rawSpell.tier,
          flavor: rawSpell.flavor,
          input: { unit: rawSpell.input.unit, mode: rawSpell.input.mode, count: best },
          output: { unit: rawSpell.output.unit, mode: rawSpell.output.mode, count: mult * best }
        }
        return spell
      })
    ]
  ]

  /**
   * @param {spell[]} spellSet
   * @param {boolean} [front]
   */
  const drawSpellImages = (spellSet, front = false) => {
    const scale = 3
    const [gridWidth, gridHeight] = (() => {
      for (let x = 10; x >= 0; x--) for (let y = 7; y >= 0; y--) if (x * y === spellSet.length) return [x, y]
      return [10, 7]
    })()
    canvas.width = 250 * scale * gridWidth
    canvas.height = 350 * scale * gridHeight
    ctx.scale(scale, scale)
    for (let y = 0; y < gridHeight; y++)
      for (let x = 0; x < gridWidth; x++) {
        ctx.fillStyle = colorScheme.backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const spell = spellSet[y * gridWidth + x]

        if (spell) {
          ctx.fillStyle = colorScheme.lineLevelHighlights[spell.tier - 1]
          ctx.strokeStyle = ctx.fillStyle

          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.font = '25px Pirata One'
          ctx.fillText(spell.name, 125, 10, 210)

          ctx.beginPath()
          ctx.moveTo(0, 40)
          ctx.lineTo(250, 40)
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(0, 60)
          ctx.lineTo(250, 60)
          ctx.stroke()

          ctx.font = 'italic bold 10px Sans'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'bottom'
          ctx.fillText(`L${spell.tier}`, 5, 75)

          ctx.font = '12px Sans'
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'center'
          ctx.fillText(prettyUnit(spell.input), 250 / 2, 50, 240)

          ctx.beginPath()
          ctx.arc(125, 150, 75, 0, Math.PI * 2)
          ctx.stroke()

          ctx.font = 'italic bold 15px Sans'
          ctx.fillText('Place Rune Here', 125, 150)

          const flavorLines = []
          if (spell.flavor !== undefined) {
            ctx.font = 'italic 10px Sans'
            const flavorLeft = spell.flavor.split(' ')
            let currentFlavorString = /** @type {string} */ (flavorLeft.shift())
            while (flavorLeft.length) {
              if (ctx.measureText(currentFlavorString + flavorLeft[0]).width > 230) {
                flavorLines.push(currentFlavorString)
                currentFlavorString = /** @type {string} */ (flavorLeft.shift())
              } else currentFlavorString += ` ${flavorLeft.shift()}`
            }
            if (currentFlavorString.length) flavorLines.push(currentFlavorString)
          }
          const flavorHeight = (flavorLines.length + 1) * 10

          ctx.font = 'bold 10px Sans'
          let descriptionHeight = flavorHeight + 20
          const descriptionLines = []
          for (const line of [prettyUnit(spell.output)]) {
            const descriptionLeft = line.split(' ')
            let currentDescriptionString = /** @type {string} */ (descriptionLeft.shift())
            while (descriptionLeft.length) {
              if (ctx.measureText(currentDescriptionString + descriptionLeft[0]).width > 230) {
                descriptionLines.push(currentDescriptionString)
                currentDescriptionString = /** @type {string} */ (descriptionLeft.shift())
              } else currentDescriptionString += ` ${descriptionLeft.shift()}`
            }
            if (currentDescriptionString.length) descriptionLines.push(currentDescriptionString)

            descriptionHeight += descriptionLines.length * 10
          }

          ctx.beginPath()
          ctx.moveTo(0, 350 - descriptionHeight)
          ctx.lineTo(250, 350 - descriptionHeight)
          ctx.stroke()

          ctx.textAlign = 'left'
          ctx.textBaseline = 'bottom'
          if (spell.flavor !== undefined) {
            ctx.font = 'italic 10px Sans'
            for (let index = 0; index < flavorLines.length; index++)
              ctx.fillText(flavorLines[flavorLines.length - index - 1], 10, 340 - index * 10)
          }
          ctx.font = 'bold 10px Sans'
          for (let index = 0; index < descriptionLines.length; index++)
            ctx.fillText(descriptionLines[descriptionLines.length - index - 1], 10, 340 - index * 10 - flavorHeight)
        }

        if (x === gridWidth - 1) {
          ctx.translate(-250 * (gridWidth - 1), 350)
        } else ctx.translate(250, 0)
      }
    if (!front) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(scale, scale)
    ctx.fillStyle = colorScheme.outsideColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let y = 0; y < gridHeight; y++)
      for (let x = 0; x < gridWidth; x++) {
        ctx.fillStyle = colorScheme.backgroundColor
        ctx.fillRect(0, 0, 250, 350)

        const spell = spellSet[y * gridWidth + x]
        if (spell) {
          ctx.fillStyle = colorScheme.lineLevelHighlights[spell.tier - 1]
          ctx.font = 'italic 50px Pirata One'
          ctx.fillText('Spell', 250 / 2, 350 * 0.175)
          ctx.fillText('Definition', 250 / 2, 350 * (1 - 0.175))
          ctx.shadowColor = ctx.fillStyle
          ctx.shadowBlur = size / 2
          ctx.font = 'bold 150px Pirata One'
          ctx.fillText(`L${spell.tier}`, 250 / 2, 350 * 0.55)
          ctx.shadowBlur = 0
        }

        if (x === gridWidth - 1) {
          ctx.translate(-250 * (gridWidth - 1), 350)
        } else ctx.translate(250, 0)
      }
  }

  /**
   * @param {string} name
   */
  const downloadCanvas = name => {
    const link = document.createElement('a')
    link.setAttribute('download', name)
    link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
    link.click()
  }

  return {
    spells,
    drawSpellImages,
    downloadCanvas,
    get totalSpellCount() {
      return spells.reduce((prev, set) => prev + set[1].length, 0)
    },
    units
  }
}
