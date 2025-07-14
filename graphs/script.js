const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'))
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'))
import colorScheme from '../config.js'
import rawSpellsModule from '../spells.js'
import rawUnitsModule from '../spells.js'
const size = window.innerWidth / 10
const spellsModule = rawSpellsModule(canvas, ctx, size, colorScheme)
const unitsModule = rawUnitsModule(canvas, ctx, size, colorScheme)

const unitCount = [...unitsModule.units.values()].length
/** @type {Object<string, {input: number, output: number}>} */
const unitUses = Object.fromEntries(
  [...unitsModule.units.values()].map(unit => {
    let inputCount = 0
    let outputCount = 0
    for (const spell of spellsModule.spells.flatMap(set => set[1])) {
      if (spell.input.unit.name === unit.name) {
        inputCount++
        if (spell.input.mode === 'give') inputCount++
      }
      if (spell.output.unit.name === unit.name) {
        outputCount++
        if (spell.output.mode === 'take') outputCount++
      }
    }
    return [unit.name, { input: inputCount, output: outputCount }]
  })
)

const maxUses = Object.values(unitUses).reduce((prev, entry) => Math.max(prev, entry.input, entry.output), 0)

const wrapper = /** @type {HTMLDivElement} */ (document.getElementById('page_content'))

const width = (canvas.width = wrapper.clientWidth * 0.95)
const height = (canvas.height = wrapper.clientHeight * 0.95)

const unitWidth = width / unitCount
const useHeight = height / maxUses / 2

let index = 0
ctx.fillStyle = '#333'
ctx.fillRect(0, 0, canvas.width, canvas.height)
for (const [name, { input, output }] of Object.entries(unitUses)) {
  const x = index * unitWidth
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '25px mono'
  ctx.fillStyle = '#666'
  ctx.strokeStyle = '#000'
  ctx.beginPath()
  ctx.rect(x, (maxUses - input) * useHeight, unitWidth, input * useHeight)
  ctx.rect(x, height / 2, unitWidth, output * useHeight)
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'bottom'
  ctx.fillText(input.toString(), x + unitWidth / 2, height / 2)
  ctx.textBaseline = 'top'
  ctx.fillText(output.toString(), x + unitWidth / 2, height / 2)
  ctx.textBaseline = 'middle'
  ctx.save()
  ctx.translate(x + unitWidth / 2, 5)
  ctx.textAlign = 'left'
  ctx.rotate(Math.PI / 2)
  ctx.fillText(`Pay ${name}`, 0, 0, height / 2 - 50)
  ctx.restore()
  ctx.save()
  ctx.translate(x + unitWidth / 2, height - 5)
  ctx.textAlign = 'right'
  ctx.rotate(Math.PI / 2)
  ctx.fillText(`Gain ${name}`, 0, 0, height / 2 - 50)
  ctx.restore()
  index++
}
