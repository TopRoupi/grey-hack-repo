import ApplicationController from '../../../javascript/controllers/application_controller'

export default class extends ApplicationController {
  static targets = [ "source" ]

  copy() {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(this.sourceTarget);
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(this.sourceTarget);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
    document.execCommand("copy")
  }
}
