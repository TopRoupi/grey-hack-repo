import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["tabs", "highlight"]

  connect(){
    console.log(this.tabsTargets)
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


    console.log(e.offsetHeight)
    console.log(e.offsetWidth)
    console.log(e.offsetLeft)
    // console.log(e.offsetLeft - this.highlightTarget.offset().left)
  }

  unhighlight() {
    this.highlightTarget.style.opacity = "0%"
  }
}
