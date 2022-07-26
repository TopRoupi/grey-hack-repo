// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import { Turbo, cable } from "@hotwired/turbo-rails"
import * as ActiveStorage from "@rails/activestorage"
ActiveStorage.start()

import Trix from "trix"
window.Trix = Trix
require("@rails/actiontext")

import "./trix-editor-overwrites"
require("./trix-toolbar-overwrites")

import "./controllers"

import hljs from "highlight.js"
import 'highlight.js/styles/monokai-sublime.css'
var hljsDefineGreyScript = require('./gs');
hljsDefineGreyScript(hljs);


// hljs.highlightAll()
// code = document.getElementById("codetest")
// code.innerHTML = hljs.highlight(code.innerHTML, {language: "greyscript"}).value
document.addEventListener('turbo:load', (event) => {
  document.querySelectorAll('pre').forEach((block) => {
    block.innerHTML = hljs.highlight(block.innerHTML, {language: "greyscript"}).value
    // hljs.highlightBlock(block, {language: "greyscript"})
  })
})

window.Turbo = Turbo

