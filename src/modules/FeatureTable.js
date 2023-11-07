import FeatureTable from '@arcgis/core/widgets/FeatureTable'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
export class madsFeatureTableClass {
  constructor (madsMap, utils) {
    this.madsMap = madsMap
    this.utils = utils
    this.featureTablePanel = this.createFeatureTablePanel()
    this.table = this.createFeatureTable()
  }

  createFeatureTablePanel() {
    const mapElement = document.querySelector('#mapDiv')
    const widget = this.utils.createHtmlElement(
      'div',
      null,
      'attributeTable',
      null,
      document.body
    )
    let style = {
      'bottom': '0px',
      'left': '0px',
      'width': mapElement.offsetWidth + 'px'
    }
    $(widget).css(style)

    const header = this.utils.createHtmlElement(
      'div',
      null,
      'attributeTableHeader',
      null,
      widget
    )

    const label = this.utils.createHtmlElement(
      'span',
      null,
      null,
      'Attribute table',
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
      'attributeTableBody',
      null,
      widget
    )
    widgetBody.style.height = mapElement.offsetHeight / 3 + 'px'
    return widget
  }

  createFeatureTable () {
    let container = this.featureTablePanel.querySelector('.attributeTableBody');
    let table = new FeatureTable({
      visibleElements: {
        menuItems: {
          clearSelection: true,
          refreshData: true,
          toggleColumns: true,
          selectedRecordsShowAllToggle: true,
          selectedRecordsShowSelectedToggle: true,
          zoomToSelection: true
        }
      },
      view: this.madsMap.view,
      highlightEnabled: true,
      container: container
    })

    table.highlightIds.on(
      'change',
      function () {
        this.madsMap.view.graphics.removeAll()
        if (table.highlightIds.length > 0) {
          table.layer
            .queryFeatures({
              objectIds: table.highlightIds,
              returnGeometry: true
            })
            .then(
              function (results) {
                let graphics = results.features
                graphics.forEach(
                  function (graphic) {
                    this.utils.highlightObject(
                      graphic.geometry,
                      this.madsMap.view
                    )
                  }.bind(this)
                )
              }.bind(this)
            )
        }
      }.bind(this)
    )
    return table
  }

  setFeatureLayer (url, title, query) {
    const layer = new FeatureLayer({
      url: url,
      title: title,
      definitionExpression: query
    })
    this.table.layer = layer
  }

  zoomToLayer () {
    return this.table.layer.queryExtent().then(
      function (response) {
        this.madsMap.view.goTo(response.extent)
      }.bind(this)
    )
  }
}
