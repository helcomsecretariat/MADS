export const config = {
  map_div_id: 'mapDiv',
  basemap_id: '6630c54f0d9d4bff9718c1c168d47e7a',
  get_mads_data_url:
    'https://maps.helcom.fi/arcgis/rest/services/MADS/mads_links/MapServer/1/query?where=1%3D1&outFields=layer_service_id%2C+layer_id%2C+metadata_id&returnGeometry=false&f=pjson',
  get_layer_info_url:
    'https://maps.helcom.fi/arcgis/rest/services/MADS/mads_links/MapServer/1/query?outFields=abstract%2C+lineage%2C+modified%2C+layer_url%2C+download_url%2C+view_url&returnGeometry=false&f=pjson&where=layer_service_id%3D',
  get_recently_updated_url:
    'https://maps.helcom.fi/arcgis/rest/services/MADS/mads_links/MapServer/1/query?where=1%3D1&outFields=layer_service_id%2C+layer_name%2C+abstract%2C+modified&returnGeometry=false&orderByFields=modified+DESC&resultRecordCount=10&f=pjson',
  search_mads_data_url: 'https://maps.helcom.fi/arcgis/rest/services/MADS/mads_links/MapServer/1/query?outFields=layer_service_id%2C+layer_name%2C+abstract%2C+modified&returnGeometry=false&f=pjson&where=is_group_layer+%3D+0+AND+',
  metadata_url:
    'https://metadata.helcom.fi/geonetwork/srv/eng/catalog.search#/metadata/',
  download_url: 'https://maps.helcom.fi/website/MADS/download/?id=',
  legend_url_part: '/queryLegends?size=400,400&f=json&layers=show:',
  export_map_url:
    'https://maps.helcom.fi/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',

  services: [
    {
      id: 'indicators_and_assessments',
      label: 'Indicators and assessments',
      url: 'https://maps.helcom.fi/arcgis/rest/services/MADS/Indicators_and_assessments/MapServer',
      wms: 'https://maps.helcom.fi/arcgis/services/MADS/Indicators_and_assessments/MapServer/WMSServer?request=GetCapabilities&service=WMS'
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      url: 'https://maps.helcom.fi/arcgis/rest/services/MADS/Monitoring/MapServer',
      wms: 'https://maps.helcom.fi/arcgis/services/MADS/Monitoring/MapServer/WMSServer?request=GetCapabilities&service=WMS'
    },
    {
      id: 'human_activities',
      label: 'Human activities',
      url: 'https://maps.helcom.fi/arcgis/rest/services/MADS/Human_Activities/MapServer',
      wms: 'https://maps.helcom.fi/arcgis/services/MADS/Human_Activities/MapServer/WMSServer?request=GetCapabilities&service=WMS'
    },
    {
      id: 'pressures',
      label: 'Pressures',
      url: 'https://maps.helcom.fi/arcgis/rest/services/MADS/Pressures/MapServer',
      wms: 'https://maps.helcom.fi/arcgis/services/MADS/Pressures/MapServer/WMSServer?request=GetCapabilities&service=WMS'
    },
    {
      id: 'red_listed_species_and_habitats',
      label: 'Red listed species and habitats',
      url: 'https://maps.helcom.fi/arcgis/rest/services/MADS/Red_listed_species_and_habitats/MapServer',
      wms: 'https://maps.helcom.fi/arcgis/services/MADS/Red_listed_species_and_habitats/MapServer/WMSServer?request=GetCapabilities&service=WMS'
    },
    {
      id: 'biodiversity',
      label: 'Biodiversity',
      url: 'https://maps.helcom.fi/arcgis/rest/services/MADS/Biodiversity/MapServer',
      wms: 'https://maps.helcom.fi/arcgis/services/MADS/Biodiversity/MapServer/WMSServer?request=GetCapabilities&service=WMS'
    },
    {
      id: 'shipping',
      label: 'Shipping',
      url: 'https://maps.helcom.fi/arcgis/rest/services/MADS/Shipping/MapServer',
      wms: 'https://maps.helcom.fi/arcgis/services/MADS/Shipping/MapServer/WMSServer?request=GetCapabilities&service=WMS'
    },
    {
      id: 'background',
      label: 'Background',
      url: 'https://maps.helcom.fi/arcgis/rest/services/MADS/Background/MapServer',
      wms: 'https://maps.helcom.fi/arcgis/services/MADS/Background/MapServer/WMSServer?request=GetCapabilities&service=WMS'
    }
  ]
}
