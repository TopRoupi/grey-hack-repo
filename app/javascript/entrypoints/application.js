console.log("Vite ⚡️ Rails")

// Example: Load Rails libraries in Vite.
// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

// Example: Import a stylesheet in app/frontend/index.css
import "~/index.css"
import "../channels"

import { Turbo } from "@hotwired/turbo-rails"
import * as ActiveStorage from "@rails/activestorage"
ActiveStorage.start()

import Trix from "trix"
window.Trix = Trix
import "@rails/actiontext"

import "../trix-editor-overwrites"

window.Trix.config.toolbar.getDefaultHTML = toolbarDefaultHTML;

document.addEventListener("trix-initialize", updateToolbars, { once: true });

function updateToolbars(event) {
  const toolbars = document.querySelectorAll("trix-toolbar");
  const html = Trix.config.toolbar.getDefaultHTML();
  toolbars.forEach((toolbar) => (toolbar.innerHTML = html));
}

/**
 * @see https://github.com/basecamp/trix/blob/main/src/trix/config/toolbar.coffee
 */
function toolbarDefaultHTML() {
  const { lang } = Trix.config

  var toolbar = document.getElementById("toolbar-trix")
  return toolbar.innerHTML
}

import hljs from "highlight.js"
window.hljs = hljs

import "../controllers"

window.Turbo = Turbo

import LocalTime from "local-time"
LocalTime.start()
