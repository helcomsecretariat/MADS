import * as query from '@arcgis/core/rest/query'
import Query from '@arcgis/core/rest/support/Query'
export class madsQueryLayerClass {
  constructor (madsMap, utils, featureTable) {
    this.madsMap = madsMap
    this.utils = utils
    this.featureTable = featureTable
    this.queryParams = new Query({
      returnGeometry: false,
      where: '1=1',
      returnDistinctValues: true
    })
  }

  createQueryPanel (layer) {
    const layerUrl = layer.copyUrl
    const panel = this.utils.createHtmlElement(
      'div',
      null,
      'smallTextMarginLeft',
      '',
      null
    )

    const currentQueryContainer = this.utils.createHtmlElement(
      'div',
      null,
      'hidden',
      '',
      panel
    )
    this.utils.createHtmlElement(
      'div',
      null,
      'smallTextBold',
      'Filter applied',
      currentQueryContainer
    )
    const textContainer1 = this.utils.createHtmlElement(
      'div',
      null,
      'smallTextMarginLeft',
      '',
      currentQueryContainer
    )
    const currentQuery = this.utils.createHtmlElement(
      'span',
      null,
      null,
      '',
      textContainer1
    )
    let style = {
      'margin-right': '10px'
    }
    $(currentQuery).css(style)
    const removeQueryLink = this.utils.createHtmlElement(
      'span',
      null,
      'madsLink',
      'Remove filter',
      textContainer1
    )

    const currentLinkContainer = this.utils.createHtmlElement(
      'div',
      null,
      'hidden',
      '',
      panel
    )
    this.utils.createHtmlElement(
      'div',
      null,
      'smallTextBold',
      'Queried layers URL',
      currentLinkContainer
    )
    const textContainer2 = this.utils.createHtmlElement(
      'div',
      null,
      'smallTextMarginLeft',
      '',
      currentLinkContainer
    )
    const currentLink = this.utils.createHtmlElement(
      'span',
      null,
      null,
      '',
      textContainer2
    )
    style = {
      'margin-right': '10px'
    }
    $(currentLink).css(style)
    const copyLink = this.utils.createHtmlElement(
      'span',
      null,
      'madsLink',
      'Copy',
      textContainer2
    )
    $(copyLink).on('click', function () {
      navigator.clipboard.writeText($(currentLink).text())
    })

    if (layer.query != null) {
      this.setCurrentQuery(
        currentQueryContainer,
        currentQuery,
        layer.query,
        currentLinkContainer,
        currentLink,
        layerUrl + '&query=' + encodeURIComponent(layer.query),
        'block'
      )
      this.featureTable.setFeatureLayer(layer.restUrl, layer.label, layer.query)
      this.featureTable.zoomToLayer()
    } else {
      this.setCurrentQuery(
        currentQueryContainer,
        currentQuery,
        layer.query,
        currentLinkContainer,
        currentLink,
        layerUrl + '&query=' + encodeURIComponent(layer.query),
        'none'
      )
    }

    const querytitle = this.utils.createHtmlElement(
      'div',
      null,
      'smallTextBold',
      'Query layer',
      panel
    )

    const fieldLabel = this.utils.createHtmlElement(
      'label',
      null,
      null,
      'Field:',
      panel
    )
    style = {
      'margin-left': '10px'
    }
    $(fieldLabel).css(style)
    fieldLabel.setAttribute('for', 'fieldName')
    const fieldInput = this.utils.createHtmlElement(
      'select',
      null,
      'selectSmallMargins',
      '',
      panel
    )
    fieldInput.setAttribute('name', 'fieldName')
    this.addFieldValues(fieldInput, layer.fields)

    const operatorLabel = this.utils.createHtmlElement(
      'label',
      null,
      null,
      'Operator:',
      panel
    )
    fieldLabel.setAttribute('for', 'operator')
    const operatorInput = this.utils.createHtmlElement(
      'select',
      null,
      'selectSmallMargins',
      '',
      panel
    )
    operatorInput.setAttribute('name', 'operator')

    const valuesLabel = this.utils.createHtmlElement(
      'label',
      null,
      null,
      'Unique values:',
      panel
    )
    fieldLabel.setAttribute('for', 'values')
    const valuesInput = this.utils.createHtmlElement(
      'select',
      null,
      'selectSmallMargins',
      '',
      panel
    )
    valuesInput.setAttribute('name', 'values')

    const queryInput = this.utils.createHtmlElement(
      'textarea',
      null,
      'queryArea',
      '',
      panel
    )
    queryInput.setAttribute('rows', '4')
    queryInput.setAttribute(
      'placeholder',
      'Write a filter expression or construct it using lists above.'
    )

    const queryLink = this.utils.createHtmlElement(
      'span',
      null,
      'madsLink',
      'Filter',
      panel
    )
    const resetLink = this.utils.createHtmlElement(
      'span',
      null,
      'madsLink',
      'Clear',
      panel
    )

    $(fieldInput).on(
      'change',
      function (e) {
        let val = $(fieldInput).find(':selected').val()
        let operators = null
        if (val != 'Null') {
          const str = val.endsWith('_str') ? true : false
          if (str) {
            val = val.substr(0, val.length - 4)
            operators = ['=', '<>']
          } else {
            operators = ['=', '<', '<=', '>', '>=', '<>']
          }
          queryInput.value += val + ' '
          this.addOperatorValues(operators, operatorInput)
          this.addUniqueValues(layer.restUrl, val, str, valuesInput)
        }
      }.bind(this)
    )

    $(operatorInput).on('change', function (e) {
      const val = $(operatorInput).find(':selected').val()
      if (val != 'Null') {
        queryInput.value += val + ' '
      }
    })

    $(valuesInput).on('change', function (e) {
      const val = $(valuesInput).find(':selected').val()
      if (val != 'Null') {
        queryInput.value += val + ' '
      }
    })

    $(queryLink).on(
      'click',
      function () {
        if (queryInput.value != '') {
          layer.query = queryInput.value
          const l = layer.layer.findSublayerById(layer.restId)
          l.definitionExpression = layer.query
          this.setCurrentQuery(
            currentQueryContainer,
            currentQuery,
            layer.query,
            currentLinkContainer,
            currentLink,
            layerUrl + '&query=' + encodeURIComponent(layer.query),
            'block'
          )
          this.featureTable.setFeatureLayer(
            layer.restUrl,
            layer.label,
            layer.query
          )
          this.featureTable.zoomToLayer()
        }
      }.bind(this)
    )

    $(resetLink).on(
      'click',
      function () {
        queryInput.value = ''
        fieldInput.value = 'Null'
        this.removeSelectOptions(operatorInput)
        this.removeSelectOptions(valuesInput)
      }.bind(this)
    )

    $(removeQueryLink).on(
      'click',
      function () {
        queryInput.value = ''
        fieldInput.value = 'Null'
        this.removeSelectOptions(operatorInput)
        this.removeSelectOptions(valuesInput)
        layer.query = ''
        const l = layer.layer.findSublayerById(layer.restId)
        l.definitionExpression = layer.query
        this.setCurrentQuery(
          currentQueryContainer,
          currentQuery,
          layer.query,
          currentLinkContainer,
          currentLink,
          layerUrl + '&query=' + encodeURIComponent(layer.query),
          'none'
        )
        this.featureTable.setFeatureLayer(
          layer.restUrl,
          layer.label,
          layer.query
        )
        this.featureTable.zoomToLayer()
      }.bind(this)
    )

    return panel
  }

  addFieldValues (fieldInput, fields) {
    const firstOpt = this.utils.createHtmlElement(
      'option',
      null,
      null,
      '',
      fieldInput
    )
    firstOpt.setAttribute('value', 'Null')

    for (let key in fields) {
      if (!key.toLowerCase().startsWith('shape')) {
        const opt = this.utils.createHtmlElement(
          'option',
          null,
          null,
          fields[key]['alias'],
          fieldInput
        )
        opt.setAttribute(
          'value',
          key + (fields[key]['type'] == 'esriFieldTypeString' ? '_str' : '')
        )
      }
    }
  }

  addOperatorValues (operators, operatorInput) {
    this.removeSelectOptions(operatorInput)
    operators.forEach(
      function (op) {
        const opt = this.utils.createHtmlElement(
          'option',
          null,
          null,
          op,
          operatorInput
        )
        opt.setAttribute('value', op)
      }.bind(this)
    )
  }

  addUniqueValues (url, field, str, valuesInput) {
    this.queryParams.outFields = [field]
    this.queryParams.orderByFields = [field]
    this.removeSelectOptions(valuesInput)
    query.executeQueryJSON(url, this.queryParams).then(
      function (response) {
        response.features.forEach(
          function (feature) {
            const val = str
              ? "'" + feature.attributes[field] + "'"
              : feature.attributes[field]
            const opt = this.utils.createHtmlElement(
              'option',
              null,
              null,
              val,
              valuesInput
            )
          }.bind(this)
        )
      }.bind(this)
    )
  }

  removeSelectOptions (select) {
    let i
    for (i = select.options.length - 1; i >= 0; i--) {
      select.remove(i)
    }
    const firstOpt = this.utils.createHtmlElement(
      'option',
      null,
      null,
      '',
      select
    )
    firstOpt.setAttribute('value', 'Null')
  }

  setCurrentQuery (queryPanel, queryContainer, query, linkPanel, linkContainer, link, show) {
    let style = {
      display: show
    }
    $(queryPanel).css(style)
    $(linkPanel).css(style)
    $(queryContainer).html(query)
    $(linkContainer).html(link)
  }
}
