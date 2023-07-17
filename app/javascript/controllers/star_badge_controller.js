import ApplicationController from "./application_controller"
import { Current } from "current.js"

export default class extends ApplicationController {
  static values = { starableId: String, starableType: String }
  static targets = ["staredIcon", "starIcon"]

  connect() {
    super.connect()
    this.user_stared_posts = Current.user.staredPosts.split(" ")

    if (this.user_stared_posts.indexOf(this.starableIdValue) != -1) {
      this.staredIconTarget.classList.remove("hidden")
      this.starIconTarget.classList.add("hidden")
    }
  }

  star() {
    this.stimulate(
      "StarsBadgeReflex#star", this.element
    )
  }
}
