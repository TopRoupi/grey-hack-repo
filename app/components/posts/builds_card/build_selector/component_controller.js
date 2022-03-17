import ApplicationController from '../../../../javascript/controllers/application_controller'

export default class extends ApplicationController {
  connect() {
    super.connect()
  }

  import_string(event) {
    event.preventDefault()
    let export_string = prompt("export string:")
    let build_name = prompt("build name:")
    event.target.setAttribute("data-string", export_string)
    event.target.setAttribute("data-name", build_name)
    this.stimulate(
      'Posts::BuildsCard::FileableList::ComponentReflex#import_build', event.target
    )
    event.target.disabled = true
  }
}
