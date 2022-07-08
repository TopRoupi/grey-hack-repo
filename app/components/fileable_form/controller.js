import ApplicationController from '../../javascript/controllers/application_controller'

export default class extends ApplicationController {
  static targets = ["string", "build"]

  connect() {
    super.connect()
  }

  import_string(event) {
    event.preventDefault()
    var string = this.stringTarget.value
    var build_id = this.buildTarget.value
    this.stimulate(
        'FileableForm::Reflex#import_build', {"string": string, "build_id": build_id}
    )
  }
}
