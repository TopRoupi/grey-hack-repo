import ApplicationController from '../../../../javascript/controllers/application_controller'
import { FetchRequest } from '@rails/request.js'

export default class extends ApplicationController {
  static values = { url: String }

  connect() {
    super.connect()
  }

  async copy_script_to_clipboard(event) {
    const request = new FetchRequest("get", this.urlValue)
    const response = await request.perform()
    if (response.ok) {
      const body = await response.json
      this.copy_to_clipboard(body.content)
      this.stimulate('AlertReflex#alert', event.target)
    }
  }

  copy_to_clipboard(text) {
    navigator.clipboard.writeText(text)
  }
}
