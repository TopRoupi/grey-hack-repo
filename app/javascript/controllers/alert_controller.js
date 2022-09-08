import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  connect(){
  }

  close() {
    this.element.remove()
  }
}
