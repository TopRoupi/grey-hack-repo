import ApplicationController from '../../../../javascript/controllers/application_controller'

export default class extends ApplicationController {
  static targets = ["name", "string"]

  connect() {
    super.connect()
  }

  import_string(event) {
    event.preventDefault()
    var string = this.stringTarget.value
    var name = this.nameTarget.value
    this.stimulate(
      'Posts::BuildsCard::FileableList::ComponentReflex#import_build', {"string": string, "name": name}
    )
    //close modal
    document.getElementById("close-modal").click()
  }
}
