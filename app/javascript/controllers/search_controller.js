import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  refresh() {
    this.element.requestSubmit()
  }
}
