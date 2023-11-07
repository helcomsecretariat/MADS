import * as identify from '@arcgis/core/rest/identify'
import IdentifyParameters from '@arcgis/core/rest/support/IdentifyParameters'
import * as query from '@arcgis/core/rest/query'
import Query from '@arcgis/core/rest/support/Query'

export class madsFeatureInfoClass {
  constructor (madsMap, utils, container) {
    this.madsMap = madsMap
    this.utils = utils
    this.container = container
    this.objNr = 0

    this.utils.createHtmlElement(
      'div',
      null,
      'labelMessage',
      'No map objects selected',
      this.container
    )

    this.identifyParamsList = {}
    this.identificationResults = []
    this.initIdentification()
  }

  initIdentification () {
    this.madsMap.view.on(
      'click',
      function (event) {
        document.querySelector('#loadingCover').style.display = 'block'
        let visibleLayers = false
        this.identifyParamsList = {}
        this.identificationResults = []
        this.container.parentElement.style.display = 'block'

        for (let id in this.madsMap.layers) {
          if (this.madsMap.layers[id].visible) {
            visibleLayers = true
            let key = this.madsMap.layers[id].serviceUrl
            if (key in this.identifyParamsList) {
              this.identifyParamsList[key].width = this.madsMap.view.width
              this.identifyParamsList[key].height = this.madsMap.view.height
              this.identifyParamsList[key].mapExtent = this.madsMap.view.extent
              this.identifyParamsList[key].geometry = event.mapPoint
              this.identifyParamsList[key].layerIds.push(
                this.madsMap.layers[id].restId
              )
            } else {
              this.identifyParamsList[key] = new IdentifyParameters()
              this.identifyParamsList[key].tolerance = 3
              this.identifyParamsList[key].layerOption = 'all'
              this.identifyParamsList[key].returnGeometry = true
              this.identifyParamsList[key].width = this.madsMap.view.width
              this.identifyParamsList[key].height = this.madsMap.view.height
              this.identifyParamsList[key].mapExtent = this.madsMap.view.extent
              this.identifyParamsList[key].geometry = event.mapPoint
              this.identifyParamsList[key].layerIds = [
                this.madsMap.layers[id].restId
              ]
            }
          }
        }
        this.identifyLayers()
      }.bind(this)
    )
  }

  identifyLayers () {
    let reqcnt = 0
    for (let k in this.identifyParamsList) {
      if (this.identifyParamsList[k].layerIds.length > 0) {
        identify.identify(k, this.identifyParamsList[k]).then(
          function (response) {
            this.identificationResults.push.apply(
              this.identificationResults,
              response.results
            )
            reqcnt += 1
            if (Object.keys(this.identifyParamsList).length == reqcnt) {
              this.resetFeatureInfos()
              this.createFeatureInfos()
            }
          }.bind(this)
        )
      }
    }
  }

  identifyFromParamater (id, layerInfos) {
    let queryParams = new Query({
      returnGeometry: true,
      where: 'OBJECTID = ' + id,
      outFields: '*'
    })
    document.querySelector('#loadingCover').style.display = 'block'
    query.executeQueryJSON(layerInfos.restUrl, queryParams).then(
      function (response) {
        response.features.forEach(
          function (f) {
            let obj = {
              feature: {
                attributes: f.attributes,
                geometry: f.geometry
              },
              layerId: layerInfos.restId,
              layerName: layerInfos.label
            }
            this.identificationResults.push(obj)
            //this.expandWidget.expand()
            this.container.parentElement.style.display = 'block'
            this.madsMap.view.goTo(f.geometry)
            this.resetFeatureInfos()
            this.createFeatureInfos()
          }.bind(this)
        )
      }.bind(this)
    )
  }

  createFeatureInfos () {
    document.querySelector('#loadingCover').style.display = 'none'
    $(this.container).empty()    
    const panel = this.utils.createHtmlElement(
      'div',
      null,
      'margin10',
      null,
      this.container
    )
    let style = null
    if (this.identificationResults.length == 0) {
      this.utils.createHtmlElement(
        'div',
        null,
        null,
        'No objects in this location',
        panel
      )
    } else {
      this.madsMap.view.graphics.removeAll()
      this.utils.highlightObject(
        this.identificationResults[this.objNr].feature.geometry,
        this.madsMap.view
      )
      if (this.identificationResults.length > 1) {
        this.utils.createHtmlElement(
          'div',
          null,
          'centeredBold12',
          this.identificationResults.length +
            ' objects in this location. Use arrows to view other objects.',
          panel
        )
      }
      let cnt = this.objNr + 1

      let buttonsContainer = this.utils.createHtmlElement(
        'div',
        null,
        null,
        null,
        panel
      )
      style = {
        width: '100%',
        'text-align': 'center',
        'font-size': '0.75vw',
        'margin-bottom': '10px',
        'margin-top': '5px'
      }
      $(buttonsContainer).css(style)

      if (this.objNr > 0) {
        let prevButton = this.utils.createHtmlElement(
          'div',
          null,
          'madsLink',
          '<< Prev',
          buttonsContainer
        )
        style = {
          float: 'left'
        }
        $(prevButton).css(style)
        $(prevButton).on(
          'click',
          function () {
            this.objNr -= 1
            if (this.objNr >= 0) {
              this.createFeatureInfos()
            }
          }.bind(this)
        )
      }

      let cntMessage = this.utils.createHtmlElement(
        'div',
        null,
        null,
        'Object ' + cnt + ' of ' + this.identificationResults.length,
        buttonsContainer
      )
      style = {
        display: 'inline-block',
        margin: '0 auto'
      }
      $(cntMessage).css(style)

      if (this.objNr < this.identificationResults.length - 1) {
        let nextButton = this.utils.createHtmlElement(
          'div',
          null,
          'madsLink',
          'Next >>',
          buttonsContainer
        )
        style = {
          float: 'right'
        }
        $(nextButton).css(style)
        $(nextButton).on(
          'click',
          function () {
            this.objNr += 1
            if (this.objNr <= this.identificationResults.length - 1) {
              this.createFeatureInfos()
            }
          }.bind(this)
        )
      }

      this.utils.createHtmlElement(
        'div',
        null,
        'featureInfoHeader',
        this.identificationResults[this.objNr].layerName,
        panel
      )
      this.createAttributeTable(
        this.identificationResults[this.objNr].feature.attributes,
        panel,
        this.identificationResults[this.objNr].layerId,
        this.identificationResults[this.objNr].layerName
      )
    }
  }

  resetFeatureInfos () {
    this.objNr = 0
    const panel = $(this.container)
    panel.empty()
    this.utils.createHtmlElement(
      'div',
      null,
      null,
      'No map objects selected',
      panel
    )
    this.madsMap.view.graphics.removeAll()
  }

  createAttributeTable (attributes, panel, layerId, layerName) {
    let fields = null
    let type = null
    let url = null
    let linkSpan = null
    let substr = layerName.substring(0, 10)
    for (let id in this.madsMap.layers) {
      if (
        this.madsMap.layers[id].restId == layerId &&
        this.madsMap.layers[id].label.startsWith(substr)
      ) {
        fields = this.madsMap.layers[id].fields
        type = this.madsMap.layers[id].type
        url = this.madsMap.layers[id].copyUrl
      }
    }

    if (type === 'feature') {
      this.utils.createHtmlElement(
        'div',
        null,
        'smallTextBold',
        'Feature url',
        panel
      )
      let urlCountainer = this.utils.createHtmlElement(
        'div',
        null,
        'smallTextMarginLeft',
        null,
        panel
      )
  
      linkSpan = this.utils.createHtmlElement(
        'span',
        null,
        null,
        null,
        urlCountainer
      )
      let style = {
        'margin-right': '10px'
      }
      $(linkSpan).css(style)
      let copyLink = this.utils.createHtmlElement(
        'span',
        null,
        'madsLink',
        'Copy',
        urlCountainer
      )
      $(copyLink).on('click', function () {
        navigator.clipboard.writeText($(linkSpan).text())
      })
    }
    
    for (let key in attributes) {
      if (type === 'feature') {
        if (
          !key.toLowerCase().startsWith('objectid') &&
          !key.toLowerCase().startsWith('shape')
        ) {
          let row = this.utils.createHtmlElement(
            'div',
            null,
            'tableRow',
            null,
            panel
          )

          if (fields != null) {
            this.utils.createHtmlElement(
              'div',
              null,
              'tableCellCol1',
              fields[key]['alias'],
              row
            )
          } else {
            this.utils.createHtmlElement('div', null, 'tableCellCol1', key, row)
          }

          this.utils.createHtmlElement(
            'div',
            null,
            'tableCellCol2',
            attributes[key],
            row
          )
        }
        else if (key.toLowerCase() === 'objectid') {
          linkSpan.innerHTML = url + '&focusOn=' + attributes[key]
        }
      } else if (type === 'raster') {
        if (key.includes('.Pixel Value')) {
          let row = this.utils.createHtmlElement(
            'div',
            null,
            'tableRow',
            null,
            panel
          )

          this.utils.createHtmlElement(
            'div',
            null,
            'tableCellCol1',
            'Value',
            row
          )
          this.utils.createHtmlElement(
            'div',
            null,
            'tableCellCol2',
            attributes[key],
            row
          )
        }
      }
    }
  }
}
