const canvas = /** @type {HTMLCanvasElement} */ (document.createElement('canvas'))
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'))
import colorScheme from '../config.js'
import rawSpellsModule from '../spells.js'
const size = window.innerWidth / 10
document.addEventListener('DOMContentLoaded', async () => {
  const spellsModule = await rawSpellsModule(canvas, ctx, size, colorScheme)
  const values = [
    'tier',
    'name',
    'canPay',
    'canGain',
    'canGrant',
    'canDrain',
    'canGive',
    'canTake',
    'multiplier',
    'payDesc',
    'gainDesc',
    'grantDesc',
    'drainDesc',
    'giveDesc',
    'takeDesc'
  ]
    .map(key => [
      key,
      key
        .split('')
        .map(c => (c === c.toLowerCase() ? c : ` ${c.toLowerCase()}`))
        .join('')
    ])
    .map(l => [l[0], l[1][0].toUpperCase() + l[1].slice(1)])
  const page = document.getElementById('page_content')
  for (const unit of spellsModule.units.values()) {
    const wrapper = document.createElement('div')
    wrapper.addEventListener('click', () => wrapper.classList.toggle('open'))
    wrapper.classList.add('unit_wrapper')
    const title = document.createElement('div')
    title.classList.add('title')
    title.textContent = unit.name
    wrapper.appendChild(title)
    for (const [key, name] of values) {
      const line = document.createElement('div')
      line.classList.add('line')
      const nameElement = document.createElement('span')
      nameElement.classList.add('name')
      nameElement.textContent = `${name}: `
      const valueElement = document.createElement('span')
      valueElement.classList.add('value')
      // @ts-expect-error
      valueElement.textContent = unit[key]
      line.appendChild(nameElement)
      line.appendChild(valueElement)
      wrapper.appendChild(line)
      page?.appendChild(wrapper)
    }
  }
})
