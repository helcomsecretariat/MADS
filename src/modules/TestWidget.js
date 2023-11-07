import Tree from '@widgetjs/tree'

export default function createTestWidget () {
  const div = document.createElement('div')
  div.setAttribute('id', 'layer_list_id')
  div.className = "divClass"
  div.innerHTML = "Layer list test"
  return div
}
