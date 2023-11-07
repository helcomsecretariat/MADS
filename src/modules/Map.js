import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Basemap from '@arcgis/core/Basemap'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import Expand from '@arcgis/core/widgets/Expand'
import Legend from '@arcgis/core/widgets/Legend'
import Print from '@arcgis/core/widgets/Print'

export class madsMapClass {
  constructor (utils, map_div_id, basemap_id) {
    this.utils = utils
    /*this.madsBasemap = new Basemap({
      portalItem: {
        id: basemap_id
      }
    })*/

    this.map = new Map({
      basemap: 'gray-vector'
      //basemap: this.madsBasemap
    })

    this.view = new MapView({
      container: map_div_id,
      map: this.map,
      zoom: 4,
      center: [20, 60],
      popup: {
        autoOpenEnabled: false
      }
    })
    this.view.ui.move('zoom', 'bottom-right')
    this.layers = {}
    this.errorDiv = undefined
    this.errorMessage = undefined
    this.errorTitle = undefined
  }

  createBasemapsGallery () {
    const basemapGallery = new BasemapGallery({
      view: this.view,
      source: [
        //this.madsBasemap,
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

    const bgExpand = new Expand({
      view: this.view,
      content: basemapGallery,
      expanded: false,
      expandIconClass: 'esri-icon-basemap',
      expandTooltip: 'Background maps'
    })

    this.view.ui.add(bgExpand, 'bottom-left')

    basemapGallery.watch('activeBasemap', () => {
      bgExpand.collapse()
    })
  }

  createLegend () {
    const legend = new Legend({
      view: this.view
    })

    const lgExpand = new Expand({
      view: this.view,
      content: legend,
      expanded: false,
      expandIconClass: 'esri-icon-legend',
      expandTooltip: 'Legend'
    })
    
    this.view.ui.add(lgExpand, 'bottom-left')
  }

  createDraggableLegend () {

    const widget = this.utils.createHtmlElement(
      'div',
      null,
      'dragable',
      null,
      document.body
    )
    let style = {
      'top': '10px',
      'right': '10px'
    }
    $(widget).css(style)

    const header = this.utils.createHtmlElement(
      'div',
      null,
      'dragzone',
      'drag here',
      widget
    )

    this.utils.dragElement(widget, header)

    const legend = new Legend({
      view: this.view,
      container: widget
    })
  }

  createMapExport (url) {
    const print = new Print({
      view: this.view,
      printServiceUrl: url,
      templateOptions: {
        copyright: 'Helcom',
        scaleEnabled: true
      },
      allowedLayouts: ["a3-portrait", "a3-landscape"]
    })

    const meExpand = new Expand({
      view: this.view,
      content: print,
      expanded: false,
      expandIconClass: 'esri-icon-printer',
      expandTooltip: 'Export map'
    })

    this.view.ui.add(meExpand, 'bottom-left')
  }

  createLayer (props) {
    const layerInfos = {
      id: props.id,
      label: props.label,
      abstract: props.abstract,
      lineage: props.lineage,
      modified: props.modified,
      type: props.type,
      visible: props.visible,
      serviceUrl: props.serviceUrl,
      restId: props.restID,
      restUrl: props.restUrl,
      metadataUrl: props.metadataUrl,
      downloadUrl: props.downloadUrl,
      copyUrl: props.copyUrl,
      legendUrl: props.legendUrl,
      addedWithLayerList: props.addedWithLayerList,
      fields: props.fields,
      query: props.query,
      index: props.index
    }

    if (props.type === 'feature') {
      layerInfos.layer = new MapImageLayer({
        url: props.serviceUrl,
        sublayers: [
          {
            id: props.restID,
            visible: true,
            definitionExpression: props.query
          }
        ]
      })
    } else if (props.type === 'raster') {
      layerInfos.layer = new MapImageLayer({
        url: props.serviceUrl,
        sublayers: [
          {
            id: props.restID,
            visible: true
          }
        ]
      })
    }
    return layerInfos
  }
}
