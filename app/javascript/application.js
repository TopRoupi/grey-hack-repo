// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import { Turbo, cable } from "@hotwired/turbo-rails"
import * as ActiveStorage from "@rails/activestorage"
ActiveStorage.start()

import "./controllers"

// require("stylesheets/application.scss")
import "trix"
import "@rails/actiontext"

import "./trix-editor-overrides"

window.Turbo = Turbo

import '@material/mwc-button'
