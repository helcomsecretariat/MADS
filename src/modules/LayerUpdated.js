export class madsLayerUpdatedClass {
  constructor (madsMap, utils, container_id, layerList_id, url) {
    this.madsMap = madsMap
    this.utils = utils
    this.layerList_id = layerList_id,
    this.url = url
    this.createUpdatedContent(container_id)
  }

  createUpdatedContent (id) {
    const container = document.getElementById(id)
    this.utils.createHtmlElement(
      'div',
      null,
      'panelHeader',
      'Recently updated datasets',
      container
    )
    const updatedContainer = this.utils.createHtmlElement(
      'div',
      null,
      null,
      '',
      container
    )
    this.setRecentlyUpdatedLayers(updatedContainer)
  }

  setRecentlyUpdatedLayers (container) {
    $.getJSON(this.url, function (data) {
      if (data.hasOwnProperty('features') && Array.isArray(data.features)) {
        data.features.forEach(feature => {
          const updatedLayerContainer = this.utils.createHtmlElement(
            'div',
            null,
            'dashedBorder',
            '',
            container
          )
          const name = this.utils.createHtmlElement(
            'div',
            null,
            'madsLink',
            feature.attributes.layer_name,
            updatedLayerContainer
          )
          this.utils.createHtmlElement(
            'div',
            null,
            'smallText',
            'Updated on ' + feature.attributes.modified.split('T')[0],
            updatedLayerContainer
          )
          const updatedLayer = this.utils.createHtmlElement(
            'div',
            null,
            'smallText',
            feature.attributes.abstract.substring(0, 100) + '...',
            updatedLayerContainer
          )
          $(name).on(
            'click',
            function () {
              $('#' + this.layerList_id).jstree('check_node', feature.attributes.layer_service_id)
            }.bind(this)
          )
        })
        
      } else {
        madsMap.errorDiv.style.display = 'block'
        madsMap.errorTitle.innerHTML = 'MADS data load updated error. Try to reload the page.'
      }
    }.bind(this)).fail(function () {
      madsMap.errorDiv.style.display = 'block'
      madsMap.errorTitle.innerHTML = 'MADS data load updated error. Try to reload the page.'
    })
  }
}
