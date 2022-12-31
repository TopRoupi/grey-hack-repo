import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["tabs", "highlight"]

  connect(){
    for(let i in this.tabsTargets) {
      let obj = this.tabsTargets[i]
      obj.onmouseenter = () => {this.highlight(obj)}
      obj.onmouseleave = () => {this.unhighlight(obj)}
    }
  }

  highlight(e) {
    this.highlightTarget.style.opacity = "100%"
    this.highlightTarget.style.height = e.offsetHeight + "px"
    this.highlightTarget.style.width = e.offsetWidth + "px"
    this.highlightTarget.style.left = e.offsetLeft + "px"
  }

  unhighlight() {
    this.highlightTarget.style.opacity = "0%"
  }
}
