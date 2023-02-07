import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["preview"]

  connect() {
    this.update_preview()
  }

  update_preview(e) {
    if (e == undefined) {
      return
    }
    var previewElement = this.previewTarget

    var reader = new FileReader()

    reader.onload = function(e) {
      previewElement.setAttribute("src", e.target.result);
    }

    reader.readAsDataURL(e.target.files[0])
  }
}
