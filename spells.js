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
 * @prop {boolean} isUsed
 * @prop {unitMode[]} unusedModes
 */

/** @typedef {'pay'|'gain'|'grant'|'drain'|'give'|'take'|'none'} unitMode */

/**
 * @typedef {Object} rawSpell
 * @prop {string} name
 * @prop {number} tier
 * @prop {string} flavor
 * @prop {{unit: unit, mode: unitMode}} input
 * @prop {{unit: unit, mode: unitMode}} output
 * @prop {string} set
 * @prop {number} powerBoost
 */

/**
 * @typedef {Object} spell
 * @prop {string} name
 * @prop {number} tier
 * @prop {string} flavor
 * @prop {{unit: unit, mode: unitMode, count: number}} input
 * @prop {{unit: unit, mode: unitMode, count: number}} output
 * @prop {number} powerBoost
 */

class Fraction {
  /**
   * Creates a new Fraction instance.
   * @param {number} numerator The numerator of the fraction.
   * @param {number} denominator The denominator of the fraction.
   * @throws {Error} If the denominator is zero.
   */
  constructor(numerator, denominator) {
    if (denominator === 0) throw new Error('Denominator cannot be zero.')

    this.numerator = numerator
    this.denominator = denominator

    // Ensure numerator and denominator are integers
    while (this.numerator !== Math.floor(this.numerator) || this.denominator !== Math.floor(this.denominator)) {
      this.numerator *= 10
      this.denominator *= 10
    }

    // Handle negative signs: always keep negative on numerator
    if (this.denominator < 0) {
      this.numerator *= -1
      this.denominator *= -1
    }

    this.simplify() // Simplify on creation
  }

  /**
   * Calculates the greatest common divisor (GCD) using the Euclidean algorithm.
   * @param {number} a
   * @param {number} b
   * @returns {number} The GCD of a and b.
   * @private
   */
  _gcd(a, b) {
    return b === 0 ? a : this._gcd(b, a % b)
  }

  /**
   * Attempts to approximate the fraction to a simpler form,
   * such that the approximate fraction's value is within `tolerancePercent`
   * of the original fraction's value.
   *
   * @param {number} tolerancePercent The maximum allowed percentage error (e.g., 5 for 5%).
   *                                  Must be between 0 (exclusive) and 100 (exclusive).
   * @param {number} [maxApproxDenominator=100] The maximum denominator to consider for the approximate fraction.
   *                                            Higher values allow for more precise approximations but might not be "simpler".
   * @returns {Fraction} A new Fraction instance representing the approximation, or the original
   *                     fraction if no simpler approximation is found within the tolerance.
   */
  approximate(tolerancePercent, maxApproxDenominator = 100) {
    if (tolerancePercent <= 0 || tolerancePercent >= 100)
      throw new Error('Tolerance percent must be between 0 and 100 (exclusive).')

    if (maxApproxDenominator < 1) throw new Error('Maximum approximation denominator must be at least 1.')

    const originalValue = this.valueOf()
    const maxError = Math.abs(originalValue) * (tolerancePercent / 100)

    // Handle zero separately to avoid division by zero or complex logic
    if (this.numerator === 0) return new Fraction(0, 1)

    let bestApproxNum = this.numerator
    let bestApproxDen = this.denominator
    let bestComplexity = Math.abs(this.numerator) + this.denominator // A simple measure of complexity

    // Iterate through possible denominators for the approximation
    for (let den = 1; den <= maxApproxDenominator; den++) {
      const num = Math.round(originalValue * den) // Closest integer numerator for this denominator
      const approxValue = num / den

      const error = Math.abs(originalValue - approxValue)

      if (error <= maxError) {
        // If within tolerance, check if it's "simpler"
        // A simpler fraction has smaller numerator and denominator values,
        // after simplification.
        const candidateFraction = new Fraction(num, den)
        const currentComplexity = Math.abs(candidateFraction.numerator) + candidateFraction.denominator

        // Prioritize simpler fractions. If complexities are equal, prioritize accuracy.
        if (
          currentComplexity < bestComplexity ||
          (currentComplexity === bestComplexity && error < Math.abs(originalValue - bestApproxNum / bestApproxDen))
        ) {
          bestApproxNum = candidateFraction.numerator
          bestApproxDen = candidateFraction.denominator
          bestComplexity = currentComplexity
        }
      }
    }

    // Return the best approximation found, or the original simplified fraction if no better
    // approximation was within tolerance.
    return new Fraction(bestApproxNum, bestApproxDen)
  }

  /**
   * Simplifies the fraction by dividing the numerator and denominator by their GCD.
   */
  simplify() {
    if (this.numerator === 0) {
      this.denominator = 1 // 0/x simplifies to 0/1
      return
    }
    const commonDivisor = this._gcd(Math.abs(this.numerator), this.denominator)
    this.numerator /= commonDivisor
    this.denominator /= commonDivisor
  }

  /**
   * Adds another fraction or a number to this fraction.
   * @param {Fraction|number} other The fraction or number to add.
   * @returns {Fraction} A new Fraction instance representing the sum.
   */
  add(other) {
    const otherFraction = other instanceof Fraction ? other : new Fraction(other, 1)

    const newNumerator = this.numerator * otherFraction.denominator + otherFraction.numerator * this.denominator
    const newDenominator = this.denominator * otherFraction.denominator

    return new Fraction(newNumerator, newDenominator)
  }

  /**
   * Subtracts another fraction or a number from this fraction.
   * @param {Fraction|number} other The fraction or number to subtract.
   * @returns {Fraction} A new Fraction instance representing the difference.
   */
  subtract(other) {
    const otherFraction = other instanceof Fraction ? other : new Fraction(other, 1)

    const newNumerator = this.numerator * otherFraction.denominator - otherFraction.numerator * this.denominator
    const newDenominator = this.denominator * otherFraction.denominator

    return new Fraction(newNumerator, newDenominator)
  }

  /**
   * Multiplies this fraction by another fraction or a number.
   * @param {Fraction|number} other The fraction or number to multiply by.
   * @returns {Fraction} A new Fraction instance representing the product.
   */
  multiply(other) {
    const otherFraction = other instanceof Fraction ? other : new Fraction(other, 1)

    const newNumerator = this.numerator * otherFraction.numerator
    const newDenominator = this.denominator * otherFraction.denominator

    return new Fraction(newNumerator, newDenominator)
  }

  /**
   * Divides this fraction by another fraction or a number.
   * @param {Fraction|number} other The fraction or number to divide by.
   * @returns {Fraction} A new Fraction instance representing the quotient.
   * @throws {Error} If the divisor is zero.
   */
  divide(other) {
    const otherFraction = other instanceof Fraction ? other : new Fraction(other, 1)

    if (otherFraction.numerator === 0) throw new Error('Cannot divide by zero.')

    // Division is multiplication by the reciprocal
    const newNumerator = this.numerator * otherFraction.denominator
    const newDenominator = this.denominator * otherFraction.numerator

    return new Fraction(newNumerator, newDenominator)
  }

  /**
   * Returns a string representation of the fraction.
   * @returns {string} The fraction in "numerator/denominator" format.
   */
  toString() {
    return `${this.numerator}/${this.denominator}`
  }

  /**
   * Returns the decimal value of the fraction.
   * @returns {number} The decimal representation.
   */
  valueOf() {
    return this.numerator / this.denominator
  }

  /**
   * Checks if this fraction is equal to another fraction or number.
   * @param {Fraction|number} other
   * @returns {boolean} True if the fractions are equal, false otherwise.
   */
  equals(other) {
    const otherFraction = other instanceof Fraction ? other : new Fraction(other, 1)

    // Simplify both before comparing to handle equivalent but unsimplified forms
    // (e.g., 1/2 vs 2/4)
    const f1 = new Fraction(this.numerator, this.denominator) // Create new to avoid modifying original
    const f2 = new Fraction(otherFraction.numerator, otherFraction.denominator)

    return f1.numerator === f2.numerator && f1.denominator === f2.denominator
  }
}

/**
 * @param {string} filePath
 * @param {typeof import('node:fs')} [fs]
 * @returns {string}
 */
const loadTextFileSync = (filePath, fs) => {
  if (fs !== undefined) return fs.readFileSync(filePath, 'utf8')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', filePath, false)
  try {
    xhr.send()
    if (xhr.status >= 200 && xhr.status < 300) return xhr.responseText
    throw new Error(`Error loading file synchronously: HTTP status ${xhr.status}`)
  } catch (error) {
    throw new Error(`Network error during synchronous file load: ${error}`)
  }
}

/** @type {number[]} */
const spellEMs = [1, 1.1, 1.25, 1.5, 2]
/** @type {number[]} */
const unitEMBoosts = [1.1, 1.2, 1.3, 1.4]
/** @type {number[]} */
const unitEMNerfs = [1.25, 1.5, 2, 3]

export default /**
 * @param {HTMLCanvasElement | import('canvas').Canvas} canvas
 * @param {CanvasRenderingContext2D | import('canvas').CanvasRenderingContext2D} ctx
 * @param {Number} size
 * @param {import("./config").colorScheme} colorScheme
 * @param {typeof import('node:fs')} [fs]
 * @returns {{spells: [String, spell[]][], drawSpellImages: (spellSet: spell[], front?: boolean, flip?: boolean) => void, downloadCanvas: (name: string) => void, totalSpellCount: number, units: Map<String, unit>}}
 */
(canvas, ctx, size, colorScheme, fs) => {
  /** @type {Map<String, unit>} */
  const units = new Map(
    loadTextFileSync('../units.md', fs)
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
        /** @type {unit} */
        const unit = {
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
          takeDesc,
          isUsed: false,
          unusedModes: []
        }
        return unit
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
    if (unit.name === '') return ''
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

  let lastSet = ''
  let isDone = false
  /** @type {rawSpell[]} */
  const rawSpells = loadTextFileSync('../spells.md', fs)
    .split('### ')
    .map(rawUnit => {
      if (isDone) return
      let set = lastSet
      const lines = rawUnit
        .split('\n')
        .filter(x => x)
        .map(x => x.trim())
        .map(line => {
          if (line === 'BREAK') isDone = true
          if (/^## .*$/.test(line)) {
            lastSet = line.match(/^## (.*)$/)?.[1] ?? ''
            if (set === '') set = lastSet
            return ''
          }
          return line
        })
        .filter(line => line)
      if (!lines.length) return
      const name = (lines.shift() ?? '').match(/^(.*):$/)?.[1] ?? ''
      const tier = /** @type {1|2|3|4|5} */ (
        Number.parseFloat((lines.shift() ?? '').match(/^\* \*\*Tier\*\*: (.*)$/)?.[1] ?? '')
      )
      const inputName = (lines[0] ?? '').match(/^\* \*\*Input\*\*: \S+ (.*)$/)?.[1] ?? ''
      const inputMode = (lines.shift() ?? '').match(/^\* \*\*Input\*\*: (\S+) .*$/)?.[1] ?? ''
      const outputName = (lines[0] ?? '').match(/^\* \*\*Output\*\*: \S+ (.*)$/)?.[1] ?? ''
      const outputMode = (lines.shift() ?? '').match(/^\* \*\*Output\*\*: (\S+) .*$/)?.[1] ?? ''
      const flavor = (lines.shift() ?? '').match(/^\* \*\*Flavor\*\*: (.*)$/)?.[1] ?? ''
      const powerBoost = Number.parseInt((lines.shift() ?? '').match(/^\* \*\*Power Boost\*\*: (.*)$/)?.[1] ?? '')
      const inputUnit = units.get(inputName)
      const outputUnit = units.get(outputName)
      if (inputUnit === undefined) throw new Error(`Unknown unit "${inputName}"`)
      if (outputUnit === undefined) throw new Error(`Unknown unit "${outputName}"`)
      return {
        name,
        tier,
        input: { unit: inputUnit, mode: /** @type {unitMode} */ (inputMode.toLowerCase()) },
        output: { unit: outputUnit, mode: /** @type {unitMode} */ (outputMode.toLowerCase()) },
        flavor,
        set,
        powerBoost
      }
    })
    .filter(spell => spell !== undefined)

  /**
   * @param {number} tier
   * @param {unit} inputUnit
   * @param {unitMode} inputMode
   * @param {unit} outputUnit
   * @param {unitMode} outputMode
   * @param {number} [powerBoost]
   * @returns {Fraction}
   */
  const calculate = (tier, inputUnit, inputMode, outputUnit, outputMode, powerBoost = 0) => {
    let inputValue = new Fraction(inputUnit.multiplier, 1)
    if (inputMode === 'give') inputValue = inputValue.multiply(2)

    if (inputUnit.tier < tier) inputValue = inputValue.multiply(unitEMBoosts[tier - inputUnit.tier - 1])
    if (inputUnit.tier > tier) inputValue = inputValue.divide(unitEMNerfs(inputUnit.tier - tier - 1))

    inputValue = inputValue.multiply(powerBoost + 1)

    inputValue = inputValue.add(tier)

    let outputValue = new Fraction(outputUnit.multiplier, 1)
    if (outputMode === 'take') outputValue = outputValue.multiply(2)

    if (outputUnit.tier < tier) outputValue = outputValue.divide(unitEMBoosts(tier - outputUnit.tier - 1))
    if (outputUnit.tier > tier) outputValue = outputValue.multiply(unitEMNerfs(outputUnit.tier - tier + 1))

    outputValue = outputValue.multiply(powerBoost + 1)

    outputValue = outputValue.multiply(spellEMs[tier - 1])

    return inputValue.divide(outputValue).approximate(10)
  }

  lastSet = ''
  /** @type {[String, spell[]][]} */
  const spells = rawSpells.reduce(
    /**
     * @param {[String, spell[]][]} prev
     * @param {rawSpell} rawSpell
     * @returns {[String, spell[]][]}
     */
    (prev, rawSpell) => {
      const ratio = calculate(
        rawSpell.tier,
        rawSpell.input.unit,
        rawSpell.input.mode,
        rawSpell.output.unit,
        rawSpell.output.mode,
        rawSpell.powerBoost
      )

      /** @type {spell} */
      const spell = {
        name: rawSpell.name,
        tier: rawSpell.tier,
        flavor: rawSpell.flavor,
        input: {
          unit: rawSpell.input.unit,
          mode: rawSpell.input.mode,
          count: ratio.denominator
        },
        output: {
          unit: rawSpell.output.unit,
          mode: rawSpell.output.mode,
          count: ratio.numerator
        },
        powerBoost: rawSpell.powerBoost
      }

      if (rawSpell.set !== lastSet) {
        prev.push([rawSpell.set, []])
        lastSet = rawSpell.set
      }
      prev[prev.length - 1][1].push(spell)
      return prev
    },
    []
  )

  const allSpells = spells.flatMap(set => set[1])

  for (const [name, unit] of units) {
    /** @type {(keyof unit)[]} */
    const validKeys = []
    for (const key of /** @type {(keyof unit)[]} */ ([
      'canPay',
      'canGain',
      'canGrant',
      'canDrain',
      'canGive',
      'canTake'
    ]))
      if (unit[key]) validKeys.push(key)
    const validModes = /** @type {unitMode[]} */ (validKeys.map(key => key.slice(3).toLowerCase()))
    for (const mode of validModes)
      if (
        allSpells.some(
          spell =>
            (spell.input.unit.name === name && spell.input.mode === mode) ||
            (spell.output.unit.name === name && spell.output.mode === mode)
        )
      )
        unit.isUsed = true
      else unit.unusedModes.push(mode)
  }

  /**
   * @param {spell[]} spellSet
   * @param {boolean} [front]
   * @param {boolean} [flip]
   */
  const drawSpellImages = (spellSet, front = true, flip = false) => {
    const scale = 3
    const [gridWidth, gridHeight] = (() => {
      for (let x = 10; x >= 0; x--) for (let y = 7; y >= 0; y--) if (x * y === spellSet.length) return [x, y]
      return [10, 7]
    })()
    canvas.width = 250 * scale * gridWidth
    canvas.height = 350 * scale * gridHeight
    ctx.scale(scale, scale)
    for (let y = 0; y < gridHeight; y++)
      for (let x = flip ? gridWidth - 1 : 0; flip ? x >= 0 : x < gridWidth; flip ? x-- : x++) {
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
          ctx.moveTo(0, 75)
          ctx.lineTo(250, 75)
          ctx.stroke()

          ctx.font = 'italic bold 10px Sans'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'bottom'
          ctx.fillText(`T${spell.tier}`, 5, 90)

          ctx.font = '12px Sans'
          ctx.textBaseline = 'middle'
          ctx.textAlign = 'center'
          const cost = prettyUnit(spell.input)
          if (ctx.measureText(cost).width > 230) {
            let splitPoint
            for (let index = 1; splitPoint === undefined; index++)
              if (cost[Math.floor(cost.length / 2) + Math.ceil(index / 2) * (index % 2 ? 1 : -1)] === ' ')
                splitPoint = Math.floor(cost.length / 2) + Math.ceil(index / 2) * (index % 2 ? 1 : -1)
            ctx.fillText(cost.slice(0, splitPoint), 250 / 2, 50, 240)
            ctx.fillText(cost.slice(splitPoint), 250 / 2, 65, 240)
          } else ctx.fillText(prettyUnit(spell.input), 250 / 2, 57, 240)

          ctx.beginPath()
          ctx.arc(125, 165, 75, 0, Math.PI * 2)
          ctx.stroke()

          ctx.font = 'italic bold 15px Sans'
          ctx.fillText('Place Rune Here', 125, 165)

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

        if (x === (flip ? 0 : gridWidth - 1)) ctx.translate(-250 * (gridWidth - 1), 350)
        else ctx.translate(250, 0)
      }
    if (front) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(scale, scale)
    ctx.fillStyle = colorScheme.outsideColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let y = 0; y < gridHeight; y++)
      for (let x = flip ? gridWidth - 1 : 0; flip ? x >= 0 : x < gridWidth; flip ? x-- : x++) {
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
          ctx.fillText(`T ${spell.tier}`, 250 / 2, 350 * 0.55)
          ctx.shadowBlur = 0
        }

        if (x === (flip ? 0 : gridWidth - 1)) ctx.translate(-250 * (gridWidth - 1), 350)
        else ctx.translate(250, 0)
      }
  }

  /**
   * @param {string} name
   */
  const downlo"adCanvas = name => {
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
