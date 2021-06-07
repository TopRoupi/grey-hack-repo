import ApplicationController from '../../../javascript/controllers/application_controller'

export default class extends ApplicationController {
  static targets = ["icon"]

  connect() {
    this.element.onmouseenter = () => {this.shake()}
  }

  shake() {
    this.iconTarget.setAttribute(
      'style',
      "transition: 0.2s; transform: translateX(0px) translateY(0px) scale(1) rotate(-15deg) translateZ(0px);",
    )
    setTimeout(() => {
      this.iconTarget.setAttribute(
        'style',
        "transition: 0.2s; transform: translateX(0px) translateY(0px) scale(1) rotate(0deg) translateZ(0px);",
      )
    }, 200)
  }
}
