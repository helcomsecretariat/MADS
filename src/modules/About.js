export class madsAboutClass {
  constructor (madsMap, utils, container_id) {
    this.madsMap = madsMap
    this.utils = utils
    this.createAboutContent(container_id)
  }

  createAboutContent (id) {
    const container = document.getElementById(id)
    this.utils.createHtmlElement('div', null, 'panelHeader', 'About', container)

    this.utils.createHtmlElement(
      'p',
      null,
      'smallTextJustify',
      'The HELCOM Map and data service (HELCOM MADS) is an online platform that provides open access to a wide range of geographic and environmental data related to the Baltic Sea region. For example, datasets on bathymetry, biodiversity, marine protected areas, shipping traffic, and hundreds more are available to view as layers on the map explorer.',
      container
    )
    this.utils.createHtmlElement(
      'p',
      null,
      'smallTextJustify',
      'Datasets are grouped under 8 different ‘services’ which can be accessed by using the free text search tool or by browsing the services tree. The data is available in various formats, including vector and raster data and accessible as a service (ArcGIS Rest, OGC WMS, WFS). Each dataset is linked to the INSPIRE compliant <a href="https://metadata.helcom.fi/geonetwork/srv/eng/catalog.search#/home" target="_blank">HELCOM Metadata Catalogue</a> where data is made available for download. MADS also includes an array of functionalities to aid data visualization and analysis such as legend widgets, attribute tables, data querying, multiple background maps, links to unique map features, and many more.',
      container
    )

    this.utils.createHtmlElement(
      'p',
      null,
      'smallTextJustify',
      'The HELCOM MADS contains spatial data collected within the HELCOM data collection framework and related projects as outlined in <a href="https://helcom.fi/wp-content/uploads/2020/02/Monitoring-and-assessment-strategy.pdf" target="_blank">HELCOM Monitoring and Assessment Strategy</a>. Use conditions of spatial data in the map service are map layer specific. Users are entitled to view use constraints defined in metadata records of each map in the HELCOM Metadata Catalogue and cite the resource accordingly.',
      container
    )

    this.utils.createHtmlElement(
      'p',
      null,
      'smallTextJustify',
      'Upgrade of the HELCOM MADS was made possible by the EU-funded <a href="https://balticdataflows.helcom.fi/" target="_blank">Baltic Data Flows project</a>. The project seeks to enhance the sharing and harmonization of data on the marine environment originating from existing sea monitoring programs, and to move towards service-based data sharing.',
      container
    )

    this.utils.createHtmlElement(
      'hr',
      null,
      'aboutLine',
      null,
      container
    )

    const cont = this.utils.createHtmlElement(
      'div',
      null,
      'bdfContainer',
      null,
      container
    )

    const bdfImg = this.utils.createHtmlElement(
      'div',
      null,
      'bdfLogo',
      null,
      cont
    )
    $(bdfImg).on('click', function () {
      window.open('https://balticdataflows.helcom.fi/', '_blank')
    })

    const helcomImg = this.utils.createHtmlElement(
      'div',
      null,
      'helcomLogo',
      null,
      cont
    )
    $(helcomImg).on('click', function () {
      window.open('https://helcom.fi/', '_blank')
    })

    this.utils.createHtmlElement(
      'p',
      null,
      'smallTextJustify',
      'How was your experience using the HELCOM MADS? And how will you use the data? Please help us get a better understanding on this by completing <a href="https://www.surveymonkey.com/r/JHTTXCP" target="_blank">an anonymous survey</a>.',
      container
    )
  }
}
//test