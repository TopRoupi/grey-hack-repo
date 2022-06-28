import ApplicationController from '../javascript/controllers/application_controller'
import { FetchRequest } from '@rails/request.js'

export default class extends ApplicationController {
  connect() {
    this.mirror_height()

    let t = this
    window.addEventListener('resize', function(event){
      t.mirror_height()
    })
  }

  mirror_height() {
    let b_selector_element = document.getElementById("build-selector")
    let b_explorer_element = document.getElementById("explorer-content")
    b_selector_element.style.height = b_explorer_element.offsetHeight + "px"
  }
}
