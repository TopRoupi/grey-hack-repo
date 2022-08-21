import { application } from "./application"
import StimulusReflex from "stimulus_reflex"
import consumer from "../channels/consumer"
import controller from "./application_controller"
import CableReady from "cable_ready"
import debounced from  "debounced"

debounced.initialize()

import CommentsFormComponent from "../../components/comments/form/component_controller.js"
import CategoriesCard from "../../components/categories/card_controller.js"
import ScriptsCardCopyComponent from "../../components/scripts/card/copy_button/component_controller.js"
import FileableForm from "../../components/fileable_form/controller.js"
import BuildExplorer from "../../components/build_explorer_controller.js"
application.register("comments--form--component", CommentsFormComponent)
application.register("categories--card", CategoriesCard)
application.register("scripts--card--copy--component", ScriptsCardCopyComponent)
application.register("fileable-form", FileableForm)
application.register("build-explorer", BuildExplorer)

import AvatarPreview from "./avatar_preview_controller"
import Attachments from "./attachments_controller"
import Decipher from "./decipher_controller"
import Code from "./code_controller"
import CodeEditor from "./code_editor_controller"
import CableFrom from "./cable_from_controller"
application.register("avatar-preview", AvatarPreview)
application.register("attachments", Attachments)
application.register("decipher", Decipher)
application.register("code", Code)
application.register("code-editor", CodeEditor)
application.register("cable-from", CableFrom)

import { Alert, Dropdown, Modal, Toggle } from "tailwindcss-stimulus-components"

application.register("dropdown", Dropdown)
application.register("alert", Alert)
application.register("modal", Modal)
application.register("toggle", Toggle)

application.consumer = consumer

StimulusReflex.initialize(application, { controller, isolate: true })
// StimulusReflex.debug = true
CableReady.initialize({ consumer })
