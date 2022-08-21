import ApplicationController from './application_controller'

import {CodeJar} from 'codejar'
import {withLineNumbers} from 'codejar/linenumbers'

import hljs from "highlight.js"
import 'highlight.js/styles/base16/brewer.css'
// define custom highligher
var hljsDefineGreyScript = require('../gs');
hljsDefineGreyScript(hljs);

/*
Example usage:
```html
<textarea data-controller="code-editor" data-code-editor-language-value="greyscript"></textarea>
*/

export default class extends ApplicationController {
  static values = {
    language: String,
    editorclass: String,
    height: String
  }

  connect() {
    this.editor_element = this.element.insertAdjacentElement("afterend", document.createElement("div"))
    this.editor_element.classList.add("language-".concat(this.languageValue), "code-editor")

    this.editorclassValue.split(" ").forEach((c) => {
      this.editor_element.classList.add(c)
    })

    this.jar = CodeJar(this.editor_element, withLineNumbers(this.highlight))
    this.element.style.display = "none"
    this.editor_element.style.height = this.heightValue
    this.jar.updateCode(this.element.value)
    this.jar.onUpdate(code => {
      this.element.value = this.jar.toString()
    });
  }

  highlight(editor) {
    editor.textContent = editor.textContent;
    hljs.highlightElement(editor);
  }

  disconnect() {
    this.editor_element.remove()
  }
}
