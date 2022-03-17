import ApplicationController from './application_controller'

export default class extends ApplicationController {
  static targets = ["input"]

  connect(){
    super.connect()
  }

  deciphe() {
    this.stimulate(
      'DecipherReflex#deciphe', this.inputTarget.value
    )
  }
}
