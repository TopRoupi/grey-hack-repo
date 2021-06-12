import ApplicationController from '../../../javascript/controllers/application_controller'

export default class extends ApplicationController {
  static targets = ['input']

  connect() {
    super.connect()
  }

  create(event) {
    event.preventDefault()
    this.stimulate(
      'Comments::Form::ComponentReflex#create', event.target
    )
    event.target.disabled = true
  }
}
