import ApplicationController from './application_controller'
import hljs from "highlight.js"
import 'highlight.js/styles/base16/brewer.css'
// define custom highligher
var hljsDefineGreyScript = require('../gs');
hljsDefineGreyScript(hljs);
import {CodeLineNumbers} from "code-line-numbers";

/*
Example usage:
```html
<pre data-controller="code" data-code-language-value="greyscript"></pre>
*/
export default class extends ApplicationController {
  static values = {
    language: String,
  }

  connect() {
    this.element.classList.add(`language-${this.languageValue}`)
    if (!this.element.getAttribute('has-line-numbers')) {
      hljs.highlightElement(this.element)
      CodeLineNumbers.addLineNumbersTo(this.element)
    }

    this.element.setAttribute("has-line-numbers","true");
  }

  highlight(editor) {
    editor.textContent = editor.textContent;
    hljs.highlightElement(editor);
  }
}
