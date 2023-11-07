export class madsLayerSearchClass {
  constructor (madsMap, utils, container_id, searchInput_id, layerList_id, homeDiv_id, aboutDiv_id, url) {
    this.madsMap = madsMap
    this.utils = utils
    this.searchContainer = document.getElementById(container_id)
    this.searchInput = document.getElementById(searchInput_id)
    this.layerList_id = layerList_id
    this.homeContainer = document.getElementById(homeDiv_id)
    this.aboutContainer = document.getElementById(aboutDiv_id)
    this.url = url
    this.setSearch()
  }

  setSearch () {
    let foundMessage = this.utils.createHtmlElement(
      'div',
      null,
      'panelHeader',
      '',
      this.searchContainer
    )
    let style = {
      'display': 'inline-block'
    }
    $(foundMessage).css(style)

    let clearSearch = this.utils.createHtmlElement(
      'div',
      null,
      'madsLink',
      'Clear search results',
      this.searchContainer
    )
    style = {
      'margin-bottom': '10px',
      'float': 'right'
    }
    $(clearSearch).css(style)

    $(clearSearch).on(
      'click',
      function () {
        this.searchInput.value = ''
        $(foundContainer).empty()
        this.searchContainer.style.display = 'none'
        this.homeContainer.style.display = 'block'
      }.bind(this)
    )
   
    let foundContainer = this.utils.createHtmlElement(
      'div',
      null,
      null,
      '',
      this.searchContainer
    )

    this.searchInput.addEventListener(
      'keyup',
      function (event) {
        if (event.keyCode === 13) {
          if (this.searchInput.value.trim() != '') {
            $(foundContainer).empty()
            this.searchContainer.style.display = 'block'
            this.homeContainer.style.display = 'none'
            this.aboutContainer.style.display = 'none'
            this.searchLayers(this.searchInput.value, foundContainer, foundMessage)
          }
        }
      }.bind(this)
    )
  }

  searchLayers (val, container, message) {
    const valUpper = val.toUpperCase()
    let nameUrl = this.url + 'UPPER(layer_name)+LIKE+%27%25' + valUpper + '%25%27'
    let abstractUrl = this.url + 'UPPER(abstract)+LIKE+%27%25' + valUpper + '%25%27'
    let foundResults = []
    $.getJSON(
      nameUrl,
      function (data) {
        if (data.hasOwnProperty('features') && Array.isArray(data.features)) {
          data.features.forEach(feature => {
            foundResults.push(feature.attributes)
          })
          $.getJSON(
            abstractUrl,
            function (data) {
              if (
                data.hasOwnProperty('features') &&
                Array.isArray(data.features)
              ) {
                data.features.forEach(feature => {
                  let found = false
                  foundResults.forEach(res => {
                    if (res.layer_service_id == feature.attributes.layer_service_id) {
                      found = true
                    }
                  })
                  if (!found) {
                    foundResults.push(feature.attributes)
                  }
                })
                this.setFoundLayers(foundResults, val, container, message)
              } else {
                madsMap.errorDiv.style.display = 'block'
                madsMap.errorTitle.innerHTML = 'MADS data abstract search error. Try to reload the page.'
              }
            }.bind(this)
          ).fail(function () {
            madsMap.errorDiv.style.display = 'block'
            madsMap.errorTitle.innerHTML = 'MADS data abstract search error. Try to reload the page.'
          })
        } else {
          madsMap.errorDiv.style.display = 'block'
          madsMap.errorTitle.innerHTML = 'MADS data name search error. Try to reload the page.'
        }
      }.bind(this)
    ).fail(function () {
      madsMap.errorDiv.style.display = 'block'
      madsMap.errorTitle.innerHTML = 'MADS data name search error. Try to reload the page.'
    })
  }

  setFoundLayers (foundResults, val, container, message) {
    message.innerHTML = 'Layers found: ' + foundResults.length
    foundResults.forEach(result => {
      const searchLayerContainer = this.utils.createHtmlElement(
        'div',
        null,
        'dashedBorder',
        '',
        container
      )
      let markedName = result.layer_name.replace(
        new RegExp(val, 'gi'),
        match => `<mark>${match}</mark>`
      )
      const name = this.utils.createHtmlElement(
        'div',
        null,
        'madsLink',
        markedName,
        searchLayerContainer
      )
      if (result.modified !== null) {
        this.utils.createHtmlElement(
          'div',
          null,
          'smallText',
          'Updated on ' + result.modified.split('T')[0],
          searchLayerContainer
        )
      }
      if (result.abstract) {
        let markedAbstract = result.abstract.replace(
          new RegExp(val, 'gi'),
          match => `<mark>${match}</mark>`
        )
        this.utils.createHtmlElement(
          'div',
          null,
          'smallText',
          markedAbstract.substring(0, 150) + '...',
          searchLayerContainer
        )
      }

      $(name).on(
        'click',
        function () {
          $('#' + this.layerList_id).jstree('check_node', result.layer_service_id)
        }.bind(this)
      )
    })
  }
}
