import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["string", "result"]

  connect() {
    super.connect()
  }

  decompress_string(event) {
    event.preventDefault()
    var string = this.stringTarget.value
    var result_element = this.resultTarget

    this.stimulate("EncoderReflex#decompress", {"string": string})
      .then((payload) => {
        result_element.value = payload.payload
      })
  }

  compress_string(event) {
    event.preventDefault()
    var string = this.stringTarget.value
    var result_element = this.resultTarget

    this.stimulate("EncoderReflex#compress", {"string": string})
      .then((payload) => {
        result_element.value = payload.payload
      })
  }
}
