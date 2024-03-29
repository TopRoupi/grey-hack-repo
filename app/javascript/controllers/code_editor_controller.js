import ApplicationController from "./application_controller"

import {CodeJar} from "codejar"
import {withLineNumbers} from "codejar/linenumbers"

import { Remarkable } from "remarkable";
var md = new Remarkable();

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

  static targets = [ "editor", "name", "preview", "tabs" ]

  connect() {
    var hljs = window.hljs
    this.editor_element = this.editorTarget.insertAdjacentElement("afterend", document.createElement("div"))
    this.editor_element.classList.add("language-".concat(this.getLanguage()), "code-editor")

    this.editorclassValue.split(" ").forEach((c) => {
      this.editor_element.classList.add(c)
    })

    this.jar = CodeJar(this.editor_element, withLineNumbers(this.highlight))
    this.editorTarget.style.display = "none"
    this.editor_element.style.height = this.heightValue
    this.jar.updateCode(this.editorTarget.value)
    this.jar.onUpdate(code => {
      this.editorTarget.value = code
      this.updatePreview(code)
    });

    this.updatePreview(this.jar.toString())
  }

  updatePreview(code) {
    if (this.getLanguage() == "markdown") {
      this.previewTarget.innerHTML = md.render(code)
      if (this.hasTabsTarget) {
        this.tabsTarget?.classList?.remove("hidden")
      }
    } else {
      this.previewTarget.innerHTML = ""
      if (this.hasTabsTarget) {
        this.tabsTarget?.classList?.add("hidden")
      }
    }
  }

  highlight(editor) {
    hljs.highlightElement(editor);
  }

  reset() {
    this.disconnect()
    this.connect()
  }

  getLanguage() {
    const languages = {
      "src": "greyscript",
      "md": "markdown",
      "txt": "text",
      "html": "html"
    }

    const extension = this.nameTarget.value.split(".").pop()
    const language = languages[extension] || "text"

    return language
  }

  disconnect() {
    this.editor_element.parentNode.remove()
  }
}
