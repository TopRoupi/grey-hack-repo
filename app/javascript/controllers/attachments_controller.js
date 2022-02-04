import ApplicationController from './application_controller'
import Trix from 'trix'

export default class extends ApplicationController {
  static targets = ['editor', 'input'];

  connect() {
    console.log(this.inputTarget)
    console.log(this.inputTarget.value)
  }

  attach(event) {
    const postId = this.inputTarget.value;

    fetch(`/posts/${postId}.json`)
      .then(response => response.json())
      .then(post => this._createAttachment(post))
      .catch(error => {
        console.log('error', error);
      });
  }

  _createAttachment(post) {
    const editor = this.editorTarget.editor;

    const attachment = new Trix.Attachment({
      sgid: post.sgid,
      content: post.content,
    });

    editor.insertAttachment(attachment);
    editor.insertString(' ');
  }
}
