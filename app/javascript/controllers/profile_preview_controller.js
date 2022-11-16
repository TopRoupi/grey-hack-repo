import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["bannerimg", "avatarimg", "badgeimg"]

  connect(){
  }

  update_banner(e){
    this.update_preview(e.target, this.bannerimgTargets)
  }

  update_avatar(e){
    this.update_preview(e.target, this.avatarimgTargets)
  }

  update_badge(e){
    this.update_preview(e.target, this.badgeimgTargets)
  }

  update_preview(input, imgs) {
    var reader = new FileReader()
    reader.onload = function(e) {
      imgs.forEach((i) => {
        i.setAttribute("src", e.target.result);
      })
    }

    reader.readAsDataURL(input.files[0])
  }
}
