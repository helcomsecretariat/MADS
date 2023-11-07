export class madsLayerInfoClass {
  constructor (madsMap, utils, layerListDivId, featureTable, queryLayer, container) {
    this.madsMap = madsMap
    this.utils = utils
    this.layerListDivId = layerListDivId
    this.featureTable = featureTable
    this.queryLayer = queryLayer
    this.container = container
    this.utils.createHtmlElement(
      'div',
      null,
      'labelMessage',
      'No layers added to the map',
      this.container
    )
  }

  createLayerInfos (layers) {
    const panel = $(this.container)
    panel.empty()
    let visibleLayers = false
    for (let i = Object.keys(layers).length; i >= 0; i--) {
      for (let id in layers) {
        if (layers[id].index == i) {
          if (layers[id].visible) {
            visibleLayers = true
            const headercontainer = this.utils.createHtmlElement(
              'div',
              null,
              'marginTopRight5',
              '',
              panel
            )
            const headerArrow = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoHeaderOpen',
              null,
              headercontainer
            )
            const header = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoHeader',
              layers[id].label,
              headercontainer
            )

            const toolsContainer = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoToolsContainer',
              null,
              headercontainer
            )
            const content = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoContent',
              '',
              panel
            )

            const descriptionTool = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoButton',
              null,
              toolsContainer
            )
            descriptionTool.classList.add('layerInfoDescriptionButton')
            descriptionTool.setAttribute('title', 'View layer description')
            $(descriptionTool).on('click', function () {
              $(content).empty()
              $(content).show()
              headerArrow.style.display = 'inline-block'
              const datetitle = this.utils.createHtmlElement(
                'div',
                null,
                'smallTextBold',
                'Last updated',
                content
              )
              const dateContainer = this.utils.createHtmlElement(
                'div',
                null,
                'smallTextMarginLeft',
                layers[id].modified.split('T')[0],
                content
              )
  
              if (layers[id].abstract) {
                const abstracttitle = this.utils.createHtmlElement(
                  'div',
                  null,
                  'smallTextBold',
                  'Abstract',
                  content
                )
                this.utils.createReadMoreLessSection(layers[id].abstract, content)
              }
              if (layers[id].lineage) {
                const abstracttitle = this.utils.createHtmlElement(
                  'div',
                  null,
                  'smallTextBold',
                  'Lineage',
                  content
                )
                this.utils.createReadMoreLessSection(layers[id].lineage, content)
              }
            }.bind(this))

            const legendTool = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoButton',
              null,
              toolsContainer
            )
            legendTool.classList.add('layerInfoLegendButton')
            legendTool.setAttribute('title', 'View layer legend')
            $(legendTool).on('click', function () {
              $(content).empty()
              $(content).show()
              headerArrow.style.display = 'inline-block'
              const legendtitle = this.utils.createHtmlElement(
                'div',
                null,
                'smallTextBold',
                'Legend',
                content
              )
              const legendContainer = this.utils.createHtmlElement(
                'div',
                null,
                'smallTextMarginLeft',
                '',
                content
              )
              $.getJSON(
                layers[id].legendUrl,
                function (data) {
                  data.layers[0].legend.forEach(
                    function (item) {
                      const legendItem = this.utils.createHtmlElement(
                        'div',
                        null,
                        null,
                        item.label,
                        legendContainer
                      )
                      let w = 'auto'
                      let h = 'auto'
                      if (item.label === '') {
                        w = item.width + 'px'
                        h = item.height + 'px'
                      }
                      const s = {
                        'background-image':
                          'url("' +
                          layers[id].restUrl +
                          '/images/' +
                          item.url +
                          '")',
                        'padding-left': item.width + 5 + 'px',
                        'line-height': item.height + 'px',
                        'background-repeat': 'no-repeat',
                        'background-position': 'left center',
                        width: w,
                        height: h
                      }
                      $(legendItem).css(s)
                    }.bind(this)
                  )
                }.bind(this)
              ).fail(function () {
                madsMap.errorDiv.style.display = 'block'
                madsMap.errorTitle.innerHTML = 'Layer legend load error. Try to reload the page.'
              })
            }.bind(this))

            const metadataTool = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoButton',
              null,
              toolsContainer
            )
            metadataTool.classList.add('layerInfoMetadataButton')
            metadataTool.setAttribute('title', 'View metadata')
            $(metadataTool).on('click', function () {
              window.open(layers[id].metadataUrl, '_blank')
            })

            if (layers[id].downloadUrl != null) {
              const downloadTool = this.utils.createHtmlElement(
                'div',
                null,
                'layerInfoButton',
                null,
                toolsContainer
              )
              downloadTool.classList.add('layerInfoDownloadButton')
              downloadTool.setAttribute('title', 'Download dataset')
              $(downloadTool).on('click', function () {
                window.open(layers[id].downloadUrl, '_blank')
              })
            }
            
            const restTool = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoButton',
              null,
              toolsContainer
            )
            restTool.classList.add('layerInfoRestButton')
            restTool.setAttribute('title', 'View ArcGIS REST page')
            $(restTool).on('click', function () {
              window.open(layers[id].restUrl, '_blank')
            })

            const copyUrlTool = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoButton',
              null,
              toolsContainer
            )
            copyUrlTool.classList.add('layerInfoUrlButton')
            copyUrlTool.setAttribute('title', 'Get layer URL')
            $(copyUrlTool).on('click', function () {
              $(content).empty()
              $(content).show()
              headerArrow.style.display = 'inline-block'
              const urltitle = this.utils.createHtmlElement(
                'div',
                null,
                'smallTextBold',
                'Layer url',
                content
              )
              const textContainer = this.utils.createHtmlElement(
                'div',
                null,
                'smallTextMarginLeft',
                '',
                content
              )
              let linkSpan = this.utils.createHtmlElement(
                'span',
                null,
                null,
                layers[id].copyUrl,
                textContainer
              )
              let style = {
                'margin-right': '10px'
              }
              $(linkSpan).css(style)
              const copyLink = this.utils.createHtmlElement(
                'span',
                null,
                'madsLink',
                'Copy',
                textContainer
              )
              $(copyLink).on('click', function () {
                navigator.clipboard.writeText($(linkSpan).text())
              })
            }.bind(this))

            if (layers[id].type === 'feature') {
              const tableTool = this.utils.createHtmlElement(
                'div',
                null,
                'layerInfoButton',
                null,
                toolsContainer
              )
              tableTool.classList.add('layerInfoTableButton')
              tableTool.setAttribute('title', 'Attribute table')
              $(tableTool).on('click', function () {
                this.featureTable.setFeatureLayer(
                  layers[id].restUrl,
                  layers[id].label,
                  layers[id].query
                )
                this.featureTable.featureTablePanel.style.display = 'block'
              }.bind(this))

              const queryTool = this.utils.createHtmlElement(
                'div',
                null,
                'layerInfoButton',
                null,
                toolsContainer
              )
              queryTool.classList.add('layerInfoQueryButton')
              queryTool.setAttribute('title', 'Query layer')
              $(queryTool).on('click', function () {
                $(content).empty()
                $(content).show()
                headerArrow.style.display = 'inline-block'
                const queryContainer = this.utils.createHtmlElement(
                  'div',
                  null,
                  null,
                  '',
                  content
                )
                queryContainer.append(
                  this.queryLayer.createQueryPanel(layers[id])
                )
              }.bind(this))
            }
            
            const removeTool = this.utils.createHtmlElement(
              'div',
              null,
              'layerInfoButton',
              null,
              toolsContainer
            )
            removeTool.classList.add('layerInfoRemoveButton')
            removeTool.setAttribute('title', 'Remove layer')
            $(removeTool).on('click', function () {
              $('#' + this.layerListDivId).jstree('uncheck_node', id)
                let removedIndex = layers[id].index
                for (let idforindex in layers) {
                  if (layers[idforindex].index > removedIndex) {
                    layers[idforindex].index = layers[idforindex].index - 1
                  }
                }
                this.createLayerInfos(this.madsMap.layers)
            }.bind(this))

            if (
              layers[id].index !=
              this.utils.getVisibleLayersCount(layers) - 1
            ) {
              const upTool = this.utils.createHtmlElement(
                'div',
                null,
                'layerInfoButton',
                null,
                toolsContainer
              )
              upTool.classList.add('layerInfoUpButton')
              upTool.setAttribute('title', 'Move layer up')
              $(upTool).on(
                'click',
                function () {
                  const newIndex = layers[id].index + 1
                  for (let idforindex in layers) {
                    if (layers[idforindex].index == newIndex) {
                      layers[idforindex].index = newIndex - 1
                      layers[id].index = newIndex
                      this.madsMap.map.reorder(layers[id].layer, newIndex)
                    }
                  }
                  this.createLayerInfos(this.madsMap.layers)
                }.bind(this)
              )
            }

            if (layers[id].index != 0) {
              const downTool = this.utils.createHtmlElement(
                'div',
                null,
                'layerInfoButton',
                null,
                toolsContainer
              )
              downTool.classList.add('layerInfoDownButton')
              downTool.setAttribute('title', 'Move layer down')
              $(downTool).on(
                'click',
                function () {
                  const newIndex = layers[id].index - 1
                  for (let idforindex in layers) {
                    if (layers[idforindex].index == newIndex) {
                      layers[idforindex].index = newIndex + 1
                      layers[id].index = newIndex
                      this.madsMap.map.reorder(layers[id].layer, newIndex)
                    }
                  }
                  this.createLayerInfos(this.madsMap.layers)
                }.bind(this)
              )
            }
            
            $(header).on(
              'click',
              function () {
                $(content).hide()
                headerArrow.style.display = 'none'
              }.bind(this)
            )
          }
        }
      }
    }

    if (!visibleLayers) {
      this.utils.createHtmlElement(
        'div',
        null,
        'labelMessage',
        'No layers added to the map',
        panel
      )
    }
  }
}
