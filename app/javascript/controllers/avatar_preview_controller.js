import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static targets = ["img", "input"]

  connect(){
    this.update_image()
  }

  update_image() {
    var url = this.inputTarget.value
    this.imgTarget.src = url
  }
}
