/** @typedef {{func: () => void, tier:1|2|3|4|5}} rune */
export default /**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} size
 * @param {Number} padding
 * @param {import("./config").colorScheme} colorScheme
 * @returns {{runes: [String, rune[]][], drawRune: (rune: rune, drawBackground1 = true, drawBackground2 = true) => void, drawRuneTree: (runeSet: rune[]) => void, drawRuneImages: (runeSet: rune[], front?: boolean) => void, downloadCanvas: (name: string) => void, totalRuneCount: number}}
 */
(canvas, ctx, size, padding, colorScheme) => {
  /** @typedef {{scale: number, offsetX: number, offsetY: number}} normalizationValue */
  /**
   * @param  {...[number, number]} points
   * @returns {normalizationValue}
   */
  const calculateNormalize = (...points) => {
    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY
    for (const point of points) {
      minX = Math.min(point[0], minX)
      minY = Math.min(point[1], minY)
      maxX = Math.max(point[0], maxX)
      maxY = Math.max(point[1], maxY)
    }
    const width = maxX - minX + padding
    const height = maxY - minY + padding
    const scale = size / Math.max(width, height)
    const offsetX = -minX + padding / 2
    const offsetY = -minY + padding / 2
    return { scale, offsetX, offsetY }
  }

  /**
   * @param {normalizationValue} normalizationValue
   * @param {number} x
   * @param {number} y
   * @returns {[number, number]}
   */
  const normalizePoint = (normalizationValue, x, y) => [
    (x + normalizationValue.offsetX) * normalizationValue.scale,
    (y + normalizationValue.offsetY) * normalizationValue.scale
  ]

  /**
   * @param {normalizationValue} normalizationValue
   * @param {number} x
   * @returns {number}
   */
  const normalizeValue = (normalizationValue, x) => x * normalizationValue.scale

  /**
   * @param {normalizationValue} normalizationValue
   */
  const getNormalizedFunctions = normalizationValue => ({
    /**
     * @param {number} x
     * @param {number} y
     */
    moveTo: (x, y) => ctx.moveTo(...normalizePoint(normalizationValue, x, y)),
    /**
     * @param {number} x
     * @param {number} y
     */
    lineTo: (x, y) => ctx.lineTo(...normalizePoint(normalizationValue, x, y)),
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} r
     * @param {number} startAngle
     * @param {number} endAngle
     * @param {boolean} [counterclockwise]
     */
    arc: (x, y, r, startAngle, endAngle, counterclockwise) =>
      ctx.arc(
        ...normalizePoint(normalizationValue, x, y),
        normalizeValue(normalizationValue, r),
        startAngle,
        endAngle,
        counterclockwise
      )
  })

  const resetPath = () => {
    ctx.stroke()
    ctx.beginPath()
  }

  /** @type {[String, rune[]][]} */
  const runes = [
    [
      'Base (1/4)',
      [
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
          },
          tier: 1
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 10, 0, Math.PI * 2)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 25, 0, Math.PI)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            moveTo(-25, 0)
            lineTo(25, 0)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            moveTo(-20, 20)
            lineTo(20, 20)
            lineTo(0, 50)
            lineTo(-20, 20)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 10, 0, Math.PI * 2)
            resetPath()
            arc(0, -40, 25, 0, Math.PI)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 10, 0, Math.PI * 2)
            moveTo(-25, 0)
            lineTo(25, 0)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 10, 0, Math.PI * 2)
            moveTo(-20, 20)
            lineTo(20, 20)
            lineTo(0, 50)
            lineTo(-20, 20)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 25, 0, Math.PI)
            moveTo(-25, 0)
            lineTo(25, 0)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 25, 0, Math.PI)
            moveTo(-20, 20)
            lineTo(20, 20)
            lineTo(0, 50)
            lineTo(-20, 20)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            moveTo(-25, 0)
            lineTo(25, 0)
            moveTo(-20, 20)
            lineTo(20, 20)
            lineTo(0, 50)
            lineTo(-20, 20)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 10, 0, Math.PI * 2)
            resetPath()
            arc(0, -40, 25, 0, Math.PI)
            moveTo(-25, 0)
            lineTo(25, 0)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 10, 0, Math.PI * 2)
            resetPath()
            arc(0, -40, 25, 0, Math.PI)
            moveTo(-20, 20)
            lineTo(20, 20)
            lineTo(0, 50)
            lineTo(-20, 20)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 10, 0, Math.PI * 2)
            moveTo(-25, 0)
            lineTo(25, 0)
            moveTo(-20, 20)
            lineTo(20, 20)
            lineTo(0, 50)
            lineTo(-20, 20)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 25, 0, Math.PI)
            moveTo(-25, 0)
            lineTo(25, 0)
            moveTo(-20, 20)
            lineTo(20, 20)
            lineTo(0, 50)
            lineTo(-20, 20)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -30)
            lineTo(0, 30)
            resetPath()
            arc(0, -40, 10, 0, Math.PI * 2)
            resetPath()
            arc(0, -40, 25, 0, Math.PI)
            moveTo(-25, 0)
            lineTo(25, 0)
            moveTo(-20, 20)
            lineTo(20, 20)
            lineTo(0, 50)
            lineTo(-20, 20)
          },
          tier: 5
        }
      ]
    ],
    [
      'Base (2/4)',
      [
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
          },
          tier: 1
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(-20, 0)
            lineTo(-50, -30)
            lineTo(-50, 30)
            lineTo(-20, 0)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            resetPath()
            arc(0, -40, 15, 0, Math.PI * 2)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(20, 0)
            lineTo(40, -20)
            lineTo(60, 0)
            lineTo(40, 20)
            lineTo(20, 0)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(-20, 0)
            lineTo(-50, -30)
            lineTo(-50, 30)
            lineTo(-20, 0)
            resetPath()
            arc(0, -40, 15, 0, Math.PI * 2)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(-20, 0)
            lineTo(-50, -30)
            lineTo(-50, 30)
            lineTo(-20, 0)
            moveTo(20, 0)
            lineTo(40, -20)
            lineTo(60, 0)
            lineTo(40, 20)
            lineTo(20, 0)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(-20, 0)
            lineTo(-50, -30)
            lineTo(-50, 30)
            lineTo(-20, 0)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            resetPath()
            arc(0, -40, 15, 0, Math.PI * 2)
            moveTo(20, 0)
            lineTo(40, -20)
            lineTo(60, 0)
            lineTo(40, 20)
            lineTo(20, 0)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            resetPath()
            arc(0, -40, 15, 0, Math.PI * 2)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(20, 0)
            lineTo(40, -20)
            lineTo(60, 0)
            lineTo(40, 20)
            lineTo(20, 0)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(-20, 0)
            lineTo(-50, -30)
            lineTo(-50, 30)
            lineTo(-20, 0)
            resetPath()
            arc(0, -40, 15, 0, Math.PI * 2)
            moveTo(20, 0)
            lineTo(40, -20)
            lineTo(60, 0)
            lineTo(40, 20)
            lineTo(20, 0)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(-20, 0)
            lineTo(-50, -30)
            lineTo(-50, 30)
            lineTo(-20, 0)
            resetPath()
            arc(0, -40, 15, 0, Math.PI * 2)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(-20, 0)
            lineTo(-50, -30)
            lineTo(-50, 30)
            lineTo(-20, 0)
            resetPath()
            moveTo(20, 0)
            lineTo(40, -20)
            lineTo(60, 0)
            lineTo(40, 20)
            lineTo(20, 0)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            resetPath()
            arc(0, -40, 15, 0, Math.PI * 2)
            moveTo(20, 0)
            lineTo(40, -20)
            lineTo(60, 0)
            lineTo(40, 20)
            lineTo(20, 0)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-60, -60], [60, 60])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 6)
            moveTo(-40, -40)
            lineTo(40, 40)
            lineTo(-40, 40)
            lineTo(40, -40)
            moveTo(-20, 0)
            lineTo(-50, -30)
            lineTo(-50, 30)
            lineTo(-20, 0)
            resetPath()
            arc(0, -40, 15, 0, Math.PI * 2)
            moveTo(20, 0)
            lineTo(40, -20)
            lineTo(60, 0)
            lineTo(40, 20)
            lineTo(20, 0)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 5
        }
      ]
    ],
    [
      'Base (3/4)',
      [
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
          },
          tier: 1
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-30, -5)
            lineTo(-40, 34)
            lineTo(-10, 20)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-25, -35)
            lineTo(15, -35)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            resetPath()
            arc(20, -10, 12, Math.PI * 1.2, Math.PI * 0.3)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            resetPath()
            arc(2, 45, 12, Math.PI * 1.1, Math.PI * 0.1)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-30, -5)
            lineTo(-40, 34)
            lineTo(-10, 20)
            moveTo(-25, -35)
            lineTo(15, -35)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-30, -5)
            lineTo(-40, 34)
            lineTo(-10, 20)
            resetPath()
            arc(20, -10, 12, Math.PI * 1.2, Math.PI * 0.3)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-30, -5)
            lineTo(-40, 34)
            lineTo(-10, 20)
            resetPath()
            arc(2, 45, 12, Math.PI * 1.1, Math.PI * 0.1)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-25, -35)
            lineTo(15, -35)
            resetPath()
            arc(20, -10, 12, Math.PI * 1.2, Math.PI * 0.3)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-25, -35)
            lineTo(15, -35)
            resetPath()
            arc(2, 45, 12, Math.PI * 1.1, Math.PI * 0.1)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            resetPath()
            arc(20, -10, 12, Math.PI * 1.2, Math.PI * 0.3)
            resetPath()
            arc(2, 45, 12, Math.PI * 1.1, Math.PI * 0.1)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-30, -5)
            lineTo(-40, 34)
            lineTo(-10, 20)
            moveTo(-25, -35)
            lineTo(15, -35)
            resetPath()
            arc(20, -10, 12, Math.PI * 1.2, Math.PI * 0.3)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-30, -5)
            lineTo(-40, 34)
            lineTo(-10, 20)
            moveTo(-25, -35)
            lineTo(15, -35)
            resetPath()
            arc(2, 45, 12, Math.PI * 1.1, Math.PI * 0.1)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-30, -5)
            lineTo(-40, 34)
            lineTo(-10, 20)
            resetPath()
            arc(20, -10, 12, Math.PI * 1.2, Math.PI * 0.3)
            resetPath()
            arc(2, 45, 12, Math.PI * 1.1, Math.PI * 0.1)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-25, -35)
            lineTo(15, -35)
            resetPath()
            arc(20, -10, 12, Math.PI * 1.2, Math.PI * 0.3)
            resetPath()
            arc(2, 45, 12, Math.PI * 1.1, Math.PI * 0.1)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-50, -50], [50, 50])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 5)
            moveTo(0, -50)
            lineTo(-20, 10)
            lineTo(20, -10)
            lineTo(0, 50)
            moveTo(-30, -5)
            lineTo(-40, 34)
            lineTo(-10, 20)
            moveTo(-25, -35)
            lineTo(15, -35)
            resetPath()
            arc(20, -10, 12, Math.PI * 1.2, Math.PI * 0.3)
            resetPath()
            arc(2, 45, 12, Math.PI * 1.1, Math.PI * 0.1)
          },
          tier: 5
        }
      ]
    ],
    [
      'Base (4/4)',
      [
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
          },
          tier: 1
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, -60, 10, 0, Math.PI * 2)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            moveTo(-30, -10)
            lineTo(30, -10)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, 0, 50, 0, Math.PI)
          },
          tier: 2
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, -60, 10, 0, Math.PI * 2)
            moveTo(-30, -10)
            lineTo(30, -10)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, -60, 10, 0, Math.PI * 2)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, -60, 10, 0, Math.PI * 2)
            resetPath()
            arc(0, 0, 50, 0, Math.PI)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            moveTo(-30, -10)
            lineTo(30, -10)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            moveTo(-30, -10)
            lineTo(30, -10)
            resetPath()
            arc(0, 0, 50, 0, Math.PI)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
            resetPath()
            arc(0, 0, 50, 0, Math.PI)
          },
          tier: 3
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, -60, 10, 0, Math.PI * 2)
            moveTo(-30, -10)
            lineTo(30, -10)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, -60, 10, 0, Math.PI * 2)
            moveTo(-30, -10)
            lineTo(30, -10)
            resetPath()
            arc(0, 0, 50, 0, Math.PI)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, -60, 10, 0, Math.PI * 2)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
            resetPath()
            arc(0, 0, 50, 0, Math.PI)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            moveTo(-30, -10)
            lineTo(30, -10)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
            resetPath()
            arc(0, 0, 50, 0, Math.PI)
          },
          tier: 4
        },
        {
          func: () => {
            const normalizationValue = calculateNormalize([-70, -70], [70, 70])
            const { moveTo, lineTo, arc } = getNormalizedFunctions(normalizationValue)
            ctx.lineWidth = normalizeValue(normalizationValue, 7)
            moveTo(-35, 60)
            lineTo(0, -50)
            lineTo(35, 60)
            resetPath()
            arc(0, -60, 10, 0, Math.PI * 2)
            moveTo(-30, -10)
            lineTo(30, -10)
            resetPath()
            arc(0, 25, 5, 0, Math.PI * 2)
            resetPath()
            arc(0, 0, 50, 0, Math.PI)
          },
          tier: 5
        }
      ]
    ]
  ]

  /**
   * @param {rune} rune
   * @param {boolean} [drawBackground1]
   * @param {boolean} [drawBackground2]
   */
  const drawRune = (rune, drawBackground1 = true, drawBackground2 = true) => {
    if (drawBackground1) {
      ctx.fillStyle = colorScheme.outsideColor
      ctx.fillRect(0, 0, size, size)
    }
    if (drawBackground2) {
      ctx.fillStyle = colorScheme.backgroundColor
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.strokeStyle = colorScheme.lineLevelHighlights[rune.tier - 1]
    ctx.shadowColor = ctx.strokeStyle
    ctx.shadowBlur = size / 10
    rune.func()
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  /**
   * @param {rune[]} runeSet
   */
  const drawRuneTree = runeSet => {
    const scale = 1
    canvas.width = size * scale * 6
    canvas.height = size * scale * 7
    ctx.scale(scale, scale)
    ctx.fillStyle = colorScheme.outsideColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.translate(size * 2.5, 0)
    drawRune(runeSet[0])
    for (let index = 0; index < 4; index++) {
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.translate(size * (index + 0.5) + (index * size) / 3, size * 1.5)
      drawRune(runeSet[index + 1])
    }
    for (let index = 0; index < 6; index++) {
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.translate(size * index, size * 3)
      drawRune(runeSet[index + 5])
    }
    for (let index = 0; index < 4; index++) {
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.translate(size * (index + 0.5) + (index * size) / 3, size * 4.5)
      drawRune(runeSet[index + 11])
    }
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.translate(size * 2.5, size * 6)
    drawRune(runeSet[15])
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.lineWidth = size / 25
    for (let index = 0; index < 4; index++) {
      ctx.beginPath()
      const grad = ctx.createLinearGradient(0, size * 0.5, 0, size * 2)
      grad.addColorStop(0, colorScheme.lineLevelHighlights[0])
      grad.addColorStop(1, colorScheme.lineLevelHighlights[1])
      ctx.moveTo(size * 3, size * 0.5)
      ctx.lineTo(size * (index + 1) + (index * size) / 3, size * 2)
      ctx.strokeStyle = grad
      ctx.stroke()
    }
    for (const pair of [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 3],
      [1, 4],
      [2, 1],
      [2, 3],
      [2, 5],
      [3, 2],
      [3, 4],
      [3, 5]
    ]) {
      ctx.beginPath()
      const grad = ctx.createLinearGradient(0, size * 2, 0, size * 3.5)
      grad.addColorStop(0, colorScheme.lineLevelHighlights[1])
      grad.addColorStop(1, colorScheme.lineLevelHighlights[2])
      ctx.moveTo(size * (pair[0] + 1) + (pair[0] * size) / 3, size * 2)
      ctx.lineTo(size * (pair[1] + 0.5), size * 3.5)
      ctx.strokeStyle = grad
      ctx.stroke()
    }
    for (const pair of [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
      [2, 2],
      [3, 0],
      [3, 3],
      [4, 1],
      [4, 3],
      [5, 2],
      [5, 3]
    ]) {
      ctx.beginPath()
      const grad = ctx.createLinearGradient(0, size * 3.5, 0, size * 5)
      grad.addColorStop(0, colorScheme.lineLevelHighlights[2])
      grad.addColorStop(1, colorScheme.lineLevelHighlights[3])
      ctx.moveTo(size * (pair[0] + 0.5), size * 3.5)
      ctx.lineTo(size * (pair[1] + 1) + (pair[1] * size) / 3, size * 5)
      ctx.strokeStyle = grad
      ctx.stroke()
    }
    for (let index = 0; index < 4; index++) {
      ctx.beginPath()
      const grad = ctx.createLinearGradient(0, size * 5, 0, size * 6.5)
      grad.addColorStop(0, colorScheme.lineLevelHighlights[3])
      grad.addColorStop(1, colorScheme.lineLevelHighlights[4])
      ctx.moveTo(size * (index + 1) + (index * size) / 3, size * 5)
      ctx.lineTo(size * 3, size * 6.5)
      ctx.strokeStyle = grad
      ctx.stroke()
    }
    ctx.translate(size * 2.5, 0)
    drawRune(runeSet[0], false)
    for (let index = 0; index < 4; index++) {
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.translate(size * (index + 0.5) + (index * size) / 3, size * 1.5)
      drawRune(runeSet[index + 1], false)
    }
    for (let index = 0; index < 6; index++) {
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.translate(size * index, size * 3)
      drawRune(runeSet[index + 5], false)
    }
    for (let index = 0; index < 4; index++) {
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.translate(size * (index + 0.5) + (index * size) / 3, size * 4.5)
      drawRune(runeSet[index + 11], false)
    }
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.translate(size * 2.5, size * 6)
    drawRune(runeSet[15], false)
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
  }

  /**
   * @param {rune[]} runeSet
   * @param {boolean} [front]
   */
  const drawRuneImages = (runeSet, front = false) => {
    const scale = 3
    const [gridWidth, gridHeight] = (() => {
      for (let x = 10; x >= 0; x--) for (let y = 7; y >= 0; y--) if (x * y === runeSet.length) return [x, y]
      return [10, 7]
    })()
    canvas.width = size * scale * gridWidth
    canvas.height = size * scale * gridHeight
    ctx.scale(scale, scale)
    for (let y = 0; y < gridHeight; y++)
      for (let x = 0; x < gridWidth; x++) {
        const rune = runeSet[y * gridWidth + x]

        if (rune) drawRune(rune)

        if (x === gridWidth - 1) {
          ctx.translate(-size * (gridWidth - 1), size)
        } else ctx.translate(size, 0)
      }
    if (!front) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(scale, scale)
    ctx.fillStyle = colorScheme.outsideColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let y = 0; y < gridHeight; y++)
      for (let x = gridWidth - 1; x >= 0; x--) {
        const lineCount = runeSet[y * gridWidth + x]?.tier
        if (lineCount !== undefined) {
          ctx.fillStyle = colorScheme.outsideColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = colorScheme.backgroundColor
          ctx.beginPath()
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = colorScheme.lineLevelHighlights[lineCount - 1]
          ctx.font = `bold italic ${size / 6}px Pirata One`
          ctx.fillText('Spell', size / 2, size * 0.15)
          ctx.shadowColor = ctx.fillStyle
          ctx.shadowBlur = size / 2
          ctx.font = `bold ${size / 2}px Pirata One`
          ctx.fillText(`L${lineCount}`, size / 2, size * 0.55)
          ctx.shadowBlur = 0
          ctx.font = `bold italic ${size / 6}px Pirata One`
          ctx.fillText('Rune', size / 2, size * 0.85)
        }

        if (x === 0) ctx.translate(-size * (gridWidth - 1), size)
        else ctx.translate(size, 0)
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
    runes,
    drawRune,
    drawRuneTree,
    drawRuneImages,
    downloadCanvas,
    get totalRuneCount() {
      return runes.reduce((prev, set) => prev + set[1].length, 0)
    }
  }
}
