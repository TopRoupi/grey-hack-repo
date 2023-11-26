import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["explorer"]

  connect() {
    super.connect()
  }

  open(e) {
    this.hideExplorerAndReflex("Posts::MiniFilesPreviewReflex#open", e.target)
  }

  back(e) {
    this.hideExplorerAndReflex("Posts::MiniFilesPreviewReflex#back", e.target)
  }

  hideExplorerAndReflex(reflex, element) {
    this.explorerTarget.classList.add("opacity-0");

    this.stimulate(
      reflex, element
    )
  }
}
