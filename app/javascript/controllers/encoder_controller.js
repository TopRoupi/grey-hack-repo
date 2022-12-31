import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["string"]

  connect() {
    super.connect()
  }

  decode_string(event) {
    event.preventDefault()
    var string = this.stringTarget.value

    for(let i = 0; i < string.length; i++) {
      console.log(string.charCodeAt(i))
    }

    this.stimulate(
      "EncoderReflex#decode", {"string": string}
    )
  }
}
