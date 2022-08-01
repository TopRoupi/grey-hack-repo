import ApplicationController from './application_controller'
import hljs from "highlight.js"
import 'highlight.js/styles/monokai-sublime.css'
// define custom highligher
var hljsDefineGreyScript = require('../gs');
hljsDefineGreyScript(hljs);

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
        hljs.highlightElement(this.element)
    }

    highlight(editor) {
        editor.textContent = editor.textContent;
        hljs.highlightElement(editor);
    }
}
