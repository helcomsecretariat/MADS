import 'jquery'
import 'jstree'
import 'jstree/dist/themes/default/style.min.css'
import { nanoid } from 'nanoid'
import { config } from './config/config.js'
import { madsUtilsClass } from './modules/Utils.js'
import { madsMapClass } from './modules/Map.js'
import { madsLeftPanelClass } from './modules/LeftPanel.js'
import { madsWidgetPanelClass } from './modules/WidgetPanel.js'
import { madsFeatureTableClass } from './modules/FeatureTable.js'
import { madsQueryLayerClass } from './modules/QueryLayer.js'

$(function () {
  const madsProps = [
    'map_div_id',
    'basemap_id',
    'get_mads_data_url',
    'get_recently_updated_url',
    'search_mads_data_url',
    'get_layer_info_url',
    'metadata_url',
    'download_url',
    'legend_url_part',
    'export_map_url',
    'services'
  ]
  let utils = undefined
  let madsMap = undefined
  let madsWidgetPanel = undefined
  let madsFeatureTable = undefined
  let madsQueryLayer = undefined
  let madsData = {}
  let madsServicesUrls = {}
  let servicesData = []
  let layerListTreeId = nanoid()
  let datasetId = null
  let query = null
  let focusOn = null

  if (
    madsProps.every(function (mp) {
      return mp in config
    })
  ) {
    utils = new madsUtilsClass()
    madsMap = new madsMapClass(
      utils,
      config.map_div_id,
      config.basemap_id
    )

    datasetId = getURLParameter('datasetID')
    query = getURLParameter('query')
    focusOn = getURLParameter('focusOn')

    madsMap.view.when(() => {
      madsFeatureTable = new madsFeatureTableClass(madsMap, utils)
      madsQueryLayer = new madsQueryLayerClass(madsMap, utils, madsFeatureTable)
      madsWidgetPanel = new madsWidgetPanelClass(
        madsMap,
        utils,
        config.export_map_url,
        layerListTreeId,
        madsFeatureTable,
        madsQueryLayer
      )

      const mapElement = document.querySelector('#mapDiv')
      madsMap.errorDiv = utils.createHtmlElement(
        'div',
        null,
        'errorMessageContainer',
        null,
        mapElement
      )
      madsMap.errorTitle = utils.createHtmlElement(
        'div',
        null,
        'errorMessageHeader',
        null,
        madsMap.errorDiv
      )
      madsMap.errorMessage = utils.createHtmlElement(
        'div',
        null,
        'errorMessageText',
        'If error appears, please inform administrator at data@helcom.fi',
        madsMap.errorDiv
      )
      madsMap.errorDiv.style.width = mapElement.offsetWidth / 3 + 'px'
      getMadsData()
    })
  } else {
    madsMap.errorDiv.style.display = 'block'
    madsMap.errorTitle.innerHTML = 'MADS config load error. Try to reload the page.'
  }

  function getMadsData () {
    $.getJSON(config.get_mads_data_url, function (data) {
      if (data.hasOwnProperty('features') && Array.isArray(data.features)) {
        data.features.forEach(feature => {
          madsData[feature.attributes.layer_service_id] = {
            layer_id: feature.attributes.layer_id,
            metadata_id: feature.attributes.metadata_id
          }
          if (datasetId) {
            if (
              datasetId.length == 36 &&
              datasetId == feature.attributes.metadata_id
            ) {
              datasetId = feature.attributes.layer_service_id
            }
          }
        })
        getServicesData()
      } else {
        madsMap.errorDiv.style.display = 'block'
        madsMap.errorTitle.innerHTML = 'MADS data load error. Try to reload the page.'
      }
    }).fail(function () {
        madsMap.errorDiv.style.display = 'block'
        madsMap.errorTitle.innerHTML = 'MADS data load error. Try to reload the page.'
    })
  }

  function getServicesData () {
    let services = {}
    let error = false
    const serviceProps = ['id', 'label', 'url', 'wms']
    const serviceIds = []
    let servicesProcessed = 0
    config.services.forEach(service => {
      if (
        serviceProps.every(function (sp) {
          return sp in service
        })
      ) {
        serviceIds.push(service.id)
        $.getJSON(service.url + '?f=pjson', function (data) {
          servicesProcessed++
          if (data.hasOwnProperty('layers')) {
            
            madsServicesUrls[service.id] = service.url
            service.layers = data.layers
            services[service.id] = service
            if (servicesProcessed === config.services.length) {
              serviceIds.forEach(sid => {
                servicesData.push(services[sid])
              })
              new madsLeftPanelClass(
                layerListTreeId,
                datasetId,
                query,
                focusOn,
                madsMap,
                utils,
                madsWidgetPanel.madsLayerInfo,
                madsWidgetPanel.madsFeatureInfo,
                madsWidgetPanel.legendContainer,
                madsData,
                servicesData,
                madsServicesUrls,
                config.get_layer_info_url,
                config.metadata_url,
                config.download_url,
                config.legend_url_part,
                config.get_recently_updated_url,
                config.search_mads_data_url
              )
              document.querySelector('#loadingCover').style.display = 'none'
            }
          } else {
            const index = serviceIds.indexOf(service.id)
            serviceIds.splice(index, 1);
            if (servicesProcessed === config.services.length) {
              serviceIds.forEach(sid => {
                servicesData.push(services[sid])
              })
              new madsLeftPanelClass(
                layerListTreeId,
                datasetId,
                query,
                focusOn,
                madsMap,
                utils,
                madsWidgetPanel.madsLayerInfo,
                madsWidgetPanel.madsFeatureInfo,
                madsWidgetPanel.legendContainer,
                madsData,
                servicesData,
                madsServicesUrls,
                config.get_layer_info_url,
                config.metadata_url,
                config.download_url,
                config.legend_url_part,
                config.get_recently_updated_url,
                config.search_mads_data_url
              )
              document.querySelector('#loadingCover').style.display = 'none'
            }
          }
        }).fail(function () {
          error = true
          servicesProcessed++
          const index = serviceIds.indexOf(service.id)
          serviceIds.splice(index, 1);
          if (servicesProcessed === config.services.length) {
            serviceIds.forEach(sid => {
              servicesData.push(services[sid])
            })
            new madsLeftPanelClass(
              layerListTreeId,
              datasetId,
              query,
              focusOn,
              madsMap,
              utils,
              madsWidgetPanel.madsLayerInfo,
              madsWidgetPanel.madsFeatureInfo,
              madsWidgetPanel.legendContainer,
              madsData,
              servicesData,
              madsServicesUrls,
              config.get_layer_info_url,
              config.metadata_url,
              config.download_url,
              config.legend_url_part,
              config.get_recently_updated_url,
              config.search_mads_data_url
            )
            document.querySelector('#loadingCover').style.display = 'none'
          }
        })
      } else {
        madsMap.errorDiv.style.display = 'block'
        madsMap.errorTitle.innerHTML = 'MADS config load error. Try to reload the page.'
      }
    })
  }

  function getURLParameter (name) {
    return (
      decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
          location.search
        ) || [null, ''])[1].replace(/\+/g, '%20')
      ) || null
    )
  }
})
