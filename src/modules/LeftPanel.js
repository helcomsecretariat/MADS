import { madsLayerListClass } from './LayerList.js'
import { madsLayerUpdatedClass } from './LayerUpdated.js'
import { madsLayerSearchClass } from './LayerSearch.js'
import { madsAboutClass } from './About.js'
import { nanoid } from 'nanoid'

export class madsLeftPanelClass {
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
    madsData,
    servicesData,
    madsServicesUrls,
    recordUrl,
    metadataUrl,
    downloadUrl,
    legendUrlPart,
    recentlyUpdatedUrl,
    searchMadsDataUrl
  ) {
    this.treeId = treeId
    this.datasetId = datasetId
    this.query = query
    this.focusOn = focusOn
    this.madsMap = madsMap
    this.utils = utils
    this.madsLayerInfo = madsLayerInfo
    this.madsFeatureInfo = madsFeatureInfo
    this.legendContainer = legendContainer
    this.madsData = madsData
    this.servicesData = servicesData
    this.madsServicesUrls = madsServicesUrls
    this.recordUrl = recordUrl
    this.metadataUrl = metadataUrl
    this.downloadUrl = downloadUrl
    this.legendUrlPart = legendUrlPart
    this.recentlyUpdatedUrl = recentlyUpdatedUrl
    this.searchMadsDataUrl = searchMadsDataUrl
    this.createLeftPanel()
  }

  createLeftPanel () {
    const mapElement = document.querySelector('#mapDiv')
    const showPanelDiv = this.utils.createHtmlElement(
      'div',
      null,
      'showPanelDiv',
      null,
      mapElement
    )
    const leftPanelDiv = this.utils.createHtmlElement(
      'div',
      null,
      'leftPanelContainer',
      null,
      mapElement
    )
    const headerDiv = this.utils.createHtmlElement(
      'div',
      null,
      'headerContainer',
      null,
      leftPanelDiv
    )
    const hidePanelDiv = this.utils.createHtmlElement(
      'div',
      null,
      'hidePanelDiv',
      null,
      headerDiv
    )
    $(hidePanelDiv).on('click', function () {
      $(leftPanelDiv).hide()
      $(showPanelDiv).show()
    })
    $(showPanelDiv).on('click', function () {
      $(leftPanelDiv).show()
      $(showPanelDiv).hide()
    })
    const logoDiv = this.utils.createHtmlElement(
      'div',
      null,
      'logoContainer',
      null,
      headerDiv
    )
    const logo = this.utils.createHtmlElement(
      'div',
      null,
      'logo',
      null,
      logoDiv
    )
    $(logo).on('click', function () {
      window.open('https://helcom.fi')
    })
    const header = this.utils.createHtmlElement(
      'div',
      null,
      'header',
      'HELCOM Map and data service',
      logoDiv
    )
    const line = this.utils.createHtmlElement(
      'hr',
      null,
      'headerLine',
      null,
      headerDiv
    )
    const toolsDiv = this.utils.createHtmlElement(
      'div',
      null,
      'leftPanelTools',
      null,
      headerDiv
    )

    const searchInputId = nanoid()
    const searchInput = this.utils.createHtmlElement(
      'input',
      searchInputId,
      'searchInput',
      '',
      toolsDiv
    )
    searchInput.setAttribute('type', 'text')
    searchInput.setAttribute('placeholder', 'Search layer...')
    searchInput.style.display = 'none'

    const layerListInputId = nanoid()
    const layerListInput = this.utils.createHtmlElement(
      'input',
      layerListInputId,
      'searchInput',
      '',
      toolsDiv
    )
    layerListInput.setAttribute('type', 'text')
    layerListInput.setAttribute('placeholder', 'Search layer...')
    
    const aboutButton = this.utils.createHtmlElement(
      'div',
      null,
      'aboutButton',
      null,
      toolsDiv
    )
    aboutButton.setAttribute('title', 'About')
    $(aboutButton).on('click', function () {
      homeDiv.style.display = 'none'
      searchDiv.style.display = 'none'
      aboutDiv.style.display = 'block'
      layerListDiv.style.display = 'none'
      searchInput.style.display = 'inline-block'
      layerListInput.style.display = 'none'
      layerListButton.style.display = 'block'
      searchButton.style.display = 'block'
    })

    let metadataButton = this.utils.createHtmlElement(
      'div',
      null,
      'metadataButton',
      null,
      toolsDiv
    )
    metadataButton.setAttribute('title', 'Metadata catalog')
    $(metadataButton).on('click', function () {
      window.open(
        'https://metadata.helcom.fi/geonetwork/srv/eng/catalog.search#/home',
        '_blank'
      )
    })

    const layerListButton = this.utils.createHtmlElement(
      'div',
      null,
      'layerListButton',
      null,
      toolsDiv
    )
    layerListButton.setAttribute('title', 'Browse layers')
    $(layerListButton).on('click', function () {
      homeDiv.style.display = 'none'
      searchDiv.style.display = 'none'
      aboutDiv.style.display = 'none'
      layerListDiv.style.display = 'block'
      searchInput.style.display = 'none'
      layerListInput.style.display = 'inline-block'
      layerListButton.style.display = 'none'
      searchButton.style.display = 'block'
    })

    const searchButton = this.utils.createHtmlElement(
      'div',
      null,
      'searchButton',
      null,
      toolsDiv
    )
    searchButton.setAttribute('title', 'Search layers')
    $(searchButton).on('click', function () {
      layerListDiv.style.display = 'none'
      aboutDiv.style.display = 'none'
      if (searchInput.value.trim() == '') {
        searchDiv.style.display = 'none'
        homeDiv.style.display = 'block'
      } else {
        homeDiv.style.display = 'none'
        searchDiv.style.display = 'block'
      }
      layerListInput.style.display = 'none'
      searchInput.style.display = 'inline-block'
      layerListButton.style.display = 'block'
      searchButton.style.display = 'none'
    })

    const panelDiv = this.utils.createHtmlElement(
      'div',
      null,
      'panelContainer',
      null,
      leftPanelDiv
    )

    const homeDivId = nanoid()
    const homeDiv = this.utils.createHtmlElement(
      'div',
      homeDivId,
      'margin10',
      null,
      panelDiv
    )
    homeDiv.style.display = 'none'

    const searchDivId = nanoid()
    const searchDiv = this.utils.createHtmlElement(
      'div',
      searchDivId,
      'margin10',
      null,
      panelDiv
    )
    searchDiv.style.display = 'none'

    const layerListDivId = nanoid()
    const layerListDiv = this.utils.createHtmlElement(
      'div',
      layerListDivId,
      'marginTopBottom10',
      null,
      panelDiv
    )

    const aboutDivId = nanoid()
    const aboutDiv = this.utils.createHtmlElement(
      'div',
      aboutDivId,
      'margin40',
      null,
      panelDiv
    )
    aboutDiv.style.display = 'none'

    this.createUpdatedLayers(homeDivId, this.treeId)
    this.createSearchLayers(searchDivId, searchInputId, this.treeId, homeDivId, aboutDivId)
    this.createLayerList(layerListDivId, layerListInputId)
    this.createAbout(aboutDivId)

    const resizeObserver = new ResizeObserver(() => {
      leftPanelDiv.style.width = mapElement.offsetWidth / 3 + 'px'
      leftPanelDiv.style.maxWidth = mapElement.offsetWidth / 3 + 'px'
      panelDiv.style.maxHeight = mapElement.offsetHeight - 186 + 'px'
    })
    resizeObserver.observe(mapElement)
  }

  createLayerList (id, layerListInputId) {
    let layerList = new madsLayerListClass(
      this.treeId,
      this.datasetId,
      this.query,
      this.focusOn,
      this.madsMap,
      this.utils,
      this.madsLayerInfo,
      this.madsFeatureInfo,
      this.legendContainer,
      id,
      layerListInputId,
      this.madsData,
      this.madsServicesUrls,
      this.recordUrl,
      this.metadataUrl,
      this.downloadUrl,
      this.legendUrlPart
    )
    layerList.createLayerList(this.servicesData)
  }

  createUpdatedLayers (id, treeId) {
    let madsLayerUpdated = new madsLayerUpdatedClass(
      this.madsMap,
      this.utils,
      id,
      treeId,
      this.recentlyUpdatedUrl
    )
  }

  createSearchLayers (id, searchInputId, treeId, homeDivId, aboutDivId) {
    let madsLayerSearch = new madsLayerSearchClass(
      this.madsMap,
      this.utils,
      id,
      searchInputId,
      treeId,
      homeDivId,
      aboutDivId,
      this.searchMadsDataUrl
    )
  }

  createAbout (id) {
    new madsAboutClass(
      this.madsMap,
      this.utils,
      id
    )
  }

  createLeftPanelTabs () {
    const tabsDiv = this.utils.createHtmlElement(
      'div',
      nanoid(),
      null,
      null,
      null
    )
    for (let key in this.tabs) {
      if (this.tabs.hasOwnProperty(key)) {
        const tab = this.utils.createHtmlElement(
          'div',
          null,
          'tab',
          null,
          tabsDiv
        )
        const button = this.utils.createHtmlElement(
          'button',
          null,
          'tablinks',
          this.tabs[key].title,
          tab
        )
        if (key === 'updated') {
          button.classList.add('active')
        }
        const id = this.tabs[key].id
        button.onclick = function (evt) {
          let i, tabcontent, tablinks
          tabcontent = document.getElementsByClassName('tabcontent')
          for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = 'none'
          }
          tablinks = document.getElementsByClassName('tablinks')
          for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(' active', '')
          }
          document.getElementById(id).style.display = 'block'
          evt.currentTarget.className += ' active'
        }
        tab.appendChild(button)
      }
    }
    for (let key in this.tabs) {
      if (this.tabs.hasOwnProperty(key)) {
        const content = this.utils.createHtmlElement(
          'div',
          this.tabs[key].id,
          'tabcontent',
          null,
          tabsDiv
        )
        this.tabs[key].node = content
        if (key === 'updated') {
          content.style.display = 'block'
        }
      }
    }
    return tabsDiv
  }
}
