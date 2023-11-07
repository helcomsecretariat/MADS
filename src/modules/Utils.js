import Expand from '@arcgis/core/widgets/Expand'
import Graphic from '@arcgis/core/Graphic'
import { nanoid } from 'nanoid'

export class madsUtilsClass {
  constructor () {}

  createExpandWidget (
    madsMap,
    initLabel,
    fixedHeight,
    widthParam,
    heightParam,
    open,
    icon,
    tooltip
  ) {
    let id = nanoid()
    let div = this.createHtmlElement('div', nanoid(), null, initLabel, null)
    let expand = new Expand({
      id: id,
      view: madsMap.view,
      content: div,
      expanded: open,
      expandIconClass: icon,
      expandTooltip: tooltip
    })

    expand.when(() => {
      const mapElement = document.querySelector('#mapDiv')
      const container = document.getElementById(id + '_controls_content')
      container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
      container.style.overflowY = 'auto'
      container.style.padding = '5px'

      const resizeObserver = new ResizeObserver(() => {
        if (fixedHeight) {
          container.style.height = mapElement.offsetHeight / heightParam + 'px'
        } else {
          container.style.maxHeight =
            mapElement.offsetHeight / heightParam + 'px'
        }

        container.style.width = mapElement.offsetWidth / widthParam + 'px'
      })
      resizeObserver.observe(mapElement)
    })
    return expand
  }

  createHtmlElement (el, id, clss, innerHTML, parent) {
    const c = document.createElement(el)
    c.innerHTML = innerHTML
    if (id !== null) {
      c.setAttribute('id', id)
    }
    if (clss !== null) {
      c.classList.add(clss)
    }
    if (parent !== null) {
      parent.append(c)
    }
    return c
  }

  createReadMoreLessSection (text, parent) {
    const container = this.createHtmlElement('div', null, null, '', parent)
    container.style.marginTop = '3px'
    const bodycontainer = this.createHtmlElement(
      'div',
      null,
      'smallTextMarginLeft',
      '',
      container
    )
    if (text.length > 100) {
      const textcontainer = this.createHtmlElement(
        'span',
        null,
        null,
        text.substring(0, 100) + '... ',
        bodycontainer
      )
      const readbutton = this.createHtmlElement(
        'span',
        null,
        'madsLink',
        'Read more',
        bodycontainer
      )
      $(readbutton).on('click', function () {
        $(textcontainer).text(
          $(textcontainer).text().length == 104
            ? text + ' '
            : text.substring(0, 100) + '... '
        )
        $(readbutton).text(
          $(readbutton).text() == 'Read more' ? 'Read less' : 'Read more'
        )
      })
    } else {
      const textcontainer = this.createHtmlElement(
        'span',
        null,
        null,
        text,
        bodycontainer
      )
    }
  }

  highlightObject (geometry, view) {
    let symbol = undefined
    if (geometry.type === 'polygon') {
      symbol = {
        type: 'simple-fill',
        color: [0, 0, 0, 0.25],
        outline: {
          color: [0, 0, 0],
          width: '1px'
        }
      }
    } else if (geometry.type === 'point') {
      symbol = {
        type: 'simple-marker',
        style: 'circle',
        color: [0, 0, 0, 0.25],
        size: '18px',
        outline: {
          color: [0, 0, 0],
          width: 2
        }
      }
    } else if (geometry.type === 'polyline') {
      symbol = {
        type: 'simple-line',
        color: [0, 0, 0, 0.5],
        width: '4px'
      }
    }
    let graphic = new Graphic(geometry, symbol)
    //view.graphics.removeAll()
    view.graphics.add(graphic)
  }

  getVisibleLayersCount (layers) {
    let count = 0
    for (let id in layers) {
      if (layers[id].visible) {
        count = count + 1
      }
    }
    return count
  }

  dragElement (element, dragzone) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0
    const dragMouseUp = () => {
      document.onmouseup = null
      document.onmousemove = null
    }

    const dragMouseMove = event => {
      event.preventDefault()
      pos1 = pos3 - event.clientX
      pos2 = pos4 - event.clientY
      pos3 = event.clientX
      pos4 = event.clientY
      element.style.top = `${element.offsetTop - pos2}px`
      element.style.left = `${element.offsetLeft - pos1}px`
    }

    const dragMouseDown = event => {
      event.preventDefault()

      pos3 = event.clientX
      pos4 = event.clientY

      document.onmouseup = dragMouseUp
      document.onmousemove = dragMouseMove
    }

    dragzone.onmousedown = dragMouseDown
  }
}
