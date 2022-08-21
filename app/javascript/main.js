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


import hljs from "highlight.js"
window.hljs = hljs

import "./controllers"

window.Turbo = Turbo

