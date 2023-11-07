import Expand from '@arcgis/core/widgets/Expand'
import { nanoid } from 'nanoid'

export class madsLeftPanelClass {
  constructor (madsMap, utils, open) {
    this.madsMap = madsMap
    this.utils = utils
    this.tabs = {
      updated: {
        id: nanoid(),
        title: 'Home',
        node: undefined
      },
      search: {
        id: nanoid(),
        title: 'Search',
        node: undefined
      },
      tree: {
        id: nanoid(),
        title: 'Browse',
        node: undefined
      }
    }

    this.tabsDiv = this.createLeftPanelTabs()
    let containerId = nanoid()
    this.expandWidget = new Expand({
      id: containerId,
      view: madsMap.view,
      content: this.tabsDiv,
      expanded: open,
      expandIconClass: 'esri-icon-search',
      expandTooltip: 'Search/browse data'
    })
    madsMap.view.ui.add(this.expandWidget, 'top-left')

    this.expandWidget.when(() => {
      const mapElement = document.querySelector('#mapDiv')
      const leftPanelElement = document.getElementById(
        containerId + '_controls_content'
      )
      leftPanelElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'

      const resizeObserver = new ResizeObserver(() => {
        leftPanelElement.style.maxHeight = mapElement.offsetHeight - 50 + 'px'
        leftPanelElement.style.maxWidth = mapElement.offsetWidth / 2 + 'px'
        for (let key in this.tabs) {
          if (this.tabs.hasOwnProperty(key)) {
            this.tabs[key].node.style.maxHeight =
              mapElement.offsetHeight - 120 + 'px'
          }
        }
      })

      resizeObserver.observe(mapElement)
    })
  }

  createLeftPanelTabs () {
    const tabsDiv = this.utils.createHtmlElement('div', nanoid(), null, null, null)
    for (let key in this.tabs) {
      if (this.tabs.hasOwnProperty(key)) {
        const tab = this.utils.createHtmlElement('div', null, 'tab', null, tabsDiv)
        const button = this.utils.createHtmlElement('button', null, 'tablinks', this.tabs[key].title, tab)
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
        const content = this.utils.createHtmlElement('div', this.tabs[key].id, 'tabcontent', null, tabsDiv)
        this.tabs[key].node = content
        if (key === 'updated') {
          content.style.display = 'block'
        }
      }
    }
    return tabsDiv
  }
}
