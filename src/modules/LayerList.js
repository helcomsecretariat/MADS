export class madsLayerListClass {
  constructor (
    treeId,
    datasetId,
    query,
    focusOn,
    madsMap,
    utils,
    madsLayerInfo,
    madsFeatureInfo,
    legendContainer,
    container_id,
    search_input_id,
    madsData,
    madsServicesUrls,
    recordUrl,
    metadataUrl,
    downloadUrl,
    legendUrlPart
  ) {
    this.treeId = treeId
    this.datasetId = datasetId
    this.startupQuery = query
    this.highlightFeatureId = focusOn
    this.madsMap = madsMap
    this.utils = utils
    this.madsLayerInfo = madsLayerInfo
    this.madsFeatureInfo = madsFeatureInfo
    this.legendContainer = legendContainer
    this.container_id = container_id
    this.search_input_id = search_input_id
    this.madsData = madsData
    this.madsServicesUrls = madsServicesUrls
    this.recordUrl = recordUrl
    this.metadataUrl = metadataUrl
    this.downloadUrl = downloadUrl
    this.legendUrlPart = legendUrlPart
  }

  getSublayers (service_id, parent, layers) {
    let sublayers = []
    layers.forEach(layer => {
      if (layer.parentLayerId === parent) {
        let id = service_id + layer.id
        if (this.madsData[id] != null) {
          let obj = {
            id: id,
            layer_id: this.madsData[id].layer_id,
            metadata_id: this.madsData[id].metadata_id
          }
          if (layer.subLayerIds != null) {
            obj.text = layer.name
            obj.a_attr = { class: 'no_checkbox', style: 'padding-right: 15px' }
            obj.children = this.getSublayers(service_id, layer.id, layers)
            obj.type = 'group'
          } else {
            obj.text = layer.name
            obj.a_attr = { style: 'padding-right: 15px' }
            if (layer.type === 'Feature Layer') {
              obj.type = 'feature'
            } else if (layer.type === 'Raster Layer') {
              obj.type = 'raster'
            }
          }
          sublayers.push(obj)
        }
      }
    })
    return sublayers
  }

  createLayerList (services) {
    let data = []
    services.forEach(service => {
      let obj = {
        id: service.id + 'root',
        text: service.label,
        type: 'group',
        a_attr: { class: 'no_checkbox', style: 'padding-right: 15px' }
      }
      obj.children = this.getSublayers(service.id, -1, service.layers)
      data.push(obj)
    })

    const container = document.getElementById(this.container_id)

    let style = {
      'font-size': '0.75vw'
    }
    $(container).css(style)

    let hideAll = this.utils.createHtmlElement(
      'div',
      null,
      'madsLink',
      'Hide all layers',
      container
    )

    let collapseAll = this.utils.createHtmlElement(
      'div',
      null,
      'madsLink',
      'Collapse layer list',
      container
    )

    style = {
      'margin-bottom': '10px',
      'margin-right': '20px',
      'float': 'right'
    }
    $(hideAll).css(style)
    $(collapseAll).css(style)

    $(hideAll).on(
      'click',
      function () {
        for (let id in this.madsMap.layers) {
          $('#' + this.treeId).jstree(
            'uncheck_node',
            id
          )
        }
        this.madsLayerInfo.createLayerInfos(this.madsMap.layers)
        this.madsFeatureInfo.resetFeatureInfos()
      }.bind(this)
    )

    $(collapseAll).on(
      'click',
      function () {
        $('#' + this.treeId).jstree('close_all')
      }.bind(this)
    )

    $('#' + this.container_id).append('<div id="' + this.treeId + '"></div>')

    $(document).on(
      'keyup',
      '#' + this.search_input_id,
      function () {
        $('#' + this.treeId).jstree(
          'search',
          $('#' + this.search_input_id).val()
        )
      }.bind(this)
    )

    $('#' + this.treeId).jstree({
      core: {
        data: data,
        themes: {
          icons: false
        }
      },
      plugins: ['checkbox', 'search'],
      checkbox: { cascade: '', three_state: false },
      search: { case_sensitive: false, show_only_matches: false },
      expand_selected_onload: true
    })

    if (this.datasetId != null) {
      $('#' + this.treeId).on(
        'ready.jstree',
        function (e, data) {
          $('#' + this.treeId).jstree('check_node', this.datasetId)
        }.bind(this)
      )
    }

    $('#' + this.treeId).on(
      'changed.jstree',
      function (e, data) {
        data.instance._open_to(data.node.id)
        data.instance.open_node(data.node.id)
        if (data.node.original.type !== 'group') {
          if (data.node.state.selected) {
            document.querySelector('#loadingCover').style.display = 'block'
            if (!this.madsMap.layers.hasOwnProperty(data.node.id)) {
              const url = this.recordUrl + "'" + data.node.id + "'"
              $.getJSON(
                url,
                function (res) {
                  if (
                    res.hasOwnProperty('features') &&
                    Array.isArray(res.features)
                  ) {
                    const recordData = res.features[0].attributes
                    const restUrl = recordData.layer_url + '?f=pjson'
                    $.getJSON(
                      restUrl,
                      function (restRes) {
                        if (restRes.hasOwnProperty('fields')) {
                          let fields = {}
                          if (Array.isArray(restRes.fields)) {
                            restRes.fields.forEach(field => {
                              fields[field.name] = {}
                              fields[field.name]['alias'] = field.alias
                              fields[field.name]['type'] = field.type
                            })
                          }
                          const layerProps = {
                            id: data.node.id,
                            label: data.node.original.text,
                            restID: data.node.original.layer_id,
                            type: data.node.original.type,
                            abstract: recordData.abstract,
                            lineage: recordData.lineage,
                            modified: recordData.modified,
                            visible: true,
                            serviceUrl:
                              this.madsServicesUrls[
                                data.node.id.replace(/[0-9]/g, '')
                              ],
                            restUrl: recordData.layer_url,
                            metadataUrl:
                              this.metadataUrl + data.node.original.metadata_id,
                            downloadUrl: recordData.download_url,
                            copyUrl: recordData.view_url,
                            legendUrl:
                              this.madsServicesUrls[
                                data.node.id.replace(/[0-9]/g, '')
                              ] +
                              this.legendUrlPart +
                              data.node.original.layer_id,
                            fields: fields,
                            query: this.startupQuery,
                            index: this.utils.getVisibleLayersCount(
                              this.madsMap.layers
                            )
                          }
                          if (this.startupQuery != null) {
                            this.startupQuery = null
                          }
                          this.madsMap.layers[data.node.id] =
                            this.madsMap.createLayer(layerProps)

                          this.madsMap.map.add(
                            this.madsMap.layers[data.node.id].layer
                          )
                          this.madsMap.layers[data.node.id].layer.on(
                            'layerview-create',
                            function (event) {
                              document.querySelector('#loadingCover').style.display = 'none'
                            }
                          )

                          this.madsLayerInfo.createLayerInfos(
                            this.madsMap.layers
                          )
                          this.madsLayerInfo.container.parentElement.style.display = 'block'
                          this.legendContainer.style.display = 'block'
                          if (
                            data.node.original.type === 'feature' &&
                            this.highlightFeatureId != null
                          ) {
                            this.madsMap.layers[data.node.id].layer.on(
                              'layerview-create',
                              function (event) {

                                this.madsFeatureInfo.identifyFromParamater(
                                  this.highlightFeatureId,
                                  this.madsMap.layers[data.node.id]
                                )
                              }.bind(this)
                            )
                          }
                        } else {
                          madsMap.errorDiv.style.display = 'block'
                          madsMap.errorTitle.innerHTML = 'REST layer fields load error. Try to reload the page.'
                        }
                      }.bind(this)
                    ).fail(function () {
                      madsMap.errorDiv.style.display = 'block'
                      madsMap.errorTitle.innerHTML = 'REST layer fields load error. Try to reload the page.'
                    })
                  } else {
                    madsMap.errorDiv.style.display = 'block'
                    madsMap.errorTitle.innerHTML = 'MADS data layer record load error. Try to reload the page.'
                  }
                }.bind(this)
              ).fail(function () {
                madsMap.errorDiv.style.display = 'block'
                madsMap.errorTitle.innerHTML = 'MADS data layer record load error. Try to reload the page.'
              })
            } else {
              this.madsMap.map.add(this.madsMap.layers[data.node.id].layer)
              this.madsMap.layers[data.node.id].index =
                this.utils.getVisibleLayersCount(this.madsMap.layers)
              this.madsMap.layers[data.node.id].visible = true
              this.madsLayerInfo.createLayerInfos(this.madsMap.layers)
            }
          } else {
            this.madsMap.map.layers.remove(
              this.madsMap.layers[data.node.id].layer
            )
            this.madsMap.layers[data.node.id].visible = false
            this.madsLayerInfo.createLayerInfos(this.madsMap.layers)
          }
          this.madsFeatureInfo.resetFeatureInfos()
        }

        let url =
          this.madsServicesUrls[data.node.id.replace(/[0-9]/g, '')] +
          '/' +
          data.node.original.layer_id
      }.bind(this)
    )
  }
}
