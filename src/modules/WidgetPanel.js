import Legend from '@arcgis/core/widgets/Legend'
import Print from '@arcgis/core/widgets/Print'
import Basemap from '@arcgis/core/Basemap'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'
import { madsLayerInfoClass } from './LayerInfo.js'
import { madsFeatureInfoClass } from './FeatureInfo.js'
export class madsWidgetPanelClass {
  constructor (
    madsMap,
    utils,
    printUrl,
    layerListDivId,
    featureTable,
    queryLayer
  ) {
    this.madsMap = madsMap
    this.utils = utils
    this.printUrl = printUrl
    this.layerListDivId = layerListDivId
    this.featureTable = featureTable
    this.queryLayer = queryLayer
    this.madsLayerInfo = undefined
    this.madsFeatureInfo = undefined
    this.legendContainer = undefined
    this.createWidgetPanel()
  }

  createWidgetPanel () {
    const mapElement = document.querySelector('#mapDiv')
    const surveyMessageDiv = this.utils.createHtmlElement(
      'div',
      null,
      'surveyMessageContainer',
      null,
      mapElement
    )

    this.utils.createHtmlElement(
      'span',
      null,
      null,
      'Tell us about your experience using the HELCOM MADS via ',
      surveyMessageDiv
    )

    const surveyLink = this.utils.createHtmlElement(
      'span',
      null,
      'surveyLink',
      'this survey',
      surveyMessageDiv
    )
    $(surveyLink).on('click', function () {
      window.open('https://www.surveymonkey.com/r/JHTTXCP', '_blank')
    })

    const close = this.utils.createHtmlElement(
      'div',
      null,
      'dragableClose',
      null,
      surveyMessageDiv
    )
    $(close).on('click', function () {
      surveyMessageDiv.style.display = 'none'
      widgetPanelDiv.style.top = '10px'
    })

    const widgetPanelDiv = this.utils.createHtmlElement(
      'div',
      null,
      'widgetPanelContainer',
      null,
      mapElement
    )

    const width = mapElement.offsetWidth

    let top = 6
    let right = 1
    this.createLayerInfoWidget(widgetPanelDiv, top, right, width / 3)
    top += 2
    right += 2
    this.createFeatureInfoWidget(widgetPanelDiv, top, right, width / 3)
    top += 2
    right += 2
    this.createPrintWidget(widgetPanelDiv, top, right)
    top += 2
    right += 2
    this.createBasemapsWidget(widgetPanelDiv, top, right)
    this.createLegendWidget(widgetPanelDiv)
  }

  createLayerInfoWidget (panel, top, right, width) {
    const button = this.utils.createHtmlElement(
      'div',
      null,
      'widgetButton',
      null,
      panel
    )
    button.classList.add('widgetLayerInfoButton')
    button.setAttribute('title', 'Map layers info')

    let style = {
      top: top + 'vw',
      right: right + 'vw',
      width: width
    }

    let widget = this.createDraggableWidget('Layers added to the map', style)

    $(button).on('click', function () {
      widget.style.display = 'block'
    })

    let widgetBody = widget.querySelector('.dragableBody')

    this.madsLayerInfo = new madsLayerInfoClass(
      this.madsMap,
      this.utils,
      this.layerListDivId,
      this.featureTable,
      this.queryLayer,
      widgetBody
    )
  }

  createFeatureInfoWidget (panel, top, right, width) {
    const button = this.utils.createHtmlElement(
      'div',
      null,
      'widgetButton',
      null,
      panel
    )
    button.classList.add('widgetFeatureInfoButton')
    button.setAttribute('title', 'Map location info')

    let style = {
      top: top + 'vw',
      right: right + 'vw',
      width: width
    }

    let widget = this.createDraggableWidget('Map location info', style)

    $(button).on('click', function () {
      widget.style.display = 'block'
    })

    let widgetBody = widget.querySelector('.dragableBody')

    this.madsFeatureInfo = new madsFeatureInfoClass(
      this.madsMap,
      this.utils,
      widgetBody
    )
  }

  createLegendWidget (panel) {
    const button = this.utils.createHtmlElement(
      'div',
      null,
      'widgetButton',
      null,
      panel
    )
    button.classList.add('widgetLegendButton')
    button.setAttribute('title', 'Legend')

    let style = {
      bottom: '2vw',
      right: '5vw'
    }

    let widget = this.createDraggableWidget('Legend', style)
    this.legendContainer = widget

    $(button).on('click', function () {
      widget.style.display = 'block'
    })

    let widgetBody = widget.querySelector('.dragableBody')
    const legend = new Legend({
      view: this.madsMap.view,
      container: widgetBody
    })
  }

  createPrintWidget (panel, top, right) {
    const button = this.utils.createHtmlElement(
      'div',
      null,
      'widgetButton',
      null,
      panel
    )
    button.classList.add('widgetPrintButton')
    button.setAttribute('title', 'Export map')

    let style = {
      top: top + 'vw',
      right: right + 'vw'
    }

    let widget = this.createDraggableWidget('Export map', style)

    $(button).on('click', function () {
      widget.style.display = 'block'
    })

    let widgetBody = widget.querySelector('.dragableBody')
    const print = new Print({
      view: this.madsMap.view,
      container: widgetBody,
      printServiceUrl: this.printUrl,
      templateOptions: {
        copyright: 'HELCOM',
        scaleEnabled: true
      },
      allowedLayouts: ['a4-portrait', 'a4-landscape']
    })
  }

  createBasemapsWidget (panel, top, right) {
    const button = this.utils.createHtmlElement(
      'div',
      null,
      'widgetButton',
      null,
      panel
    )
    button.classList.add('widgetBasemapsButton')
    button.setAttribute('title', 'Background maps')

    let style = {
      top: top + 'vw',
      right: right + 'vw'
    }

    let widget = this.createDraggableWidget('Background maps', style)

    $(button).on('click', function () {
      widget.style.display = 'block'
    })

    let widgetBody = widget.querySelector('.dragableBody')
    const basemapGallery = new BasemapGallery({
      view: this.madsMap.view,
      container: widgetBody,
      source: [
        Basemap.fromId('satellite'),
        Basemap.fromId('hybrid'),
        Basemap.fromId('oceans'),
        Basemap.fromId('osm'),
        Basemap.fromId('terrain'),
        Basemap.fromId('dark-gray-vector'),
        Basemap.fromId('gray-vector'),
        Basemap.fromId('streets-vector'),
        Basemap.fromId('streets-night-vector'),
        Basemap.fromId('streets-navigation-vector'),
        Basemap.fromId('topo-vector'),
        Basemap.fromId('streets-relief-vector')
      ]
    })
  }

  createDraggableWidget (title, style) {
    const widget = this.utils.createHtmlElement(
      'div',
      null,
      'dragableWidget',
      null,
      document.body
    )
    $(widget).css(style)

    const header = this.utils.createHtmlElement(
      'div',
      null,
      'dragableHeader',
      null,
      widget
    )

    const label = this.utils.createHtmlElement(
      'span',
      null,
      null,
      title,
      header
    )

    const close = this.utils.createHtmlElement(
      'div',
      null,
      'dragableClose',
      null,
      header
    )

    $(close).on('click', function () {
      widget.style.display = 'none'
    })

    const widgetBody = this.utils.createHtmlElement(
      'div',
      null,
      'dragableBody',
      null,
      widget
    )

    this.utils.dragElement(widget, header)
    return widget
  }
}
