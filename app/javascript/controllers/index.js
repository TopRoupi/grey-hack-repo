import { application } from "./application"
import StimulusReflex from "stimulus_reflex"
import consumer from "../channels/consumer"
import controller from "./application_controller"
import CableReady from "cable_ready"
import debounced from  "debounced"

debounced.initialize()

import NestedForm from "stimulus-rails-nested-form"
application.register("nested-form", NestedForm)

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
import Alert from "./alert_controller"
import ProfilePreview from "./profile_preview_controller"
import TabHighlight from "./tab_highlight_controller"
import Encoder from "./encoder_controller"
import ImagePreview from "./image_preview_controller"
import StarBadge from "./star_badge_controller"
import Search from "./search_controller"
application.register("avatar-preview", AvatarPreview)
application.register("attachments", Attachments)
application.register("decipher", Decipher)
application.register("code", Code)
application.register("code-editor", CodeEditor)
application.register("cable-from", CableFrom)
application.register("alert", Alert)
application.register("profile-preview", ProfilePreview)
application.register("tab-highlight", TabHighlight)
application.register("encoder", Encoder)
application.register("image-preview", ImagePreview)
application.register("star-badge", StarBadge)
application.register("search", Search)

import { Tabs, Alert as Toast, Dropdown, Modal, Toggle } from "tailwindcss-stimulus-components"

application.register("tabs", Tabs)
application.register("dropdown", Dropdown)
application.register("toast", Toast)
application.register("modal", Modal)
application.register("toggle", Toggle)

application.consumer = consumer

StimulusReflex.initialize(application, { controller, isolate: true })
// StimulusReflex.debug = true
CableReady.initialize({ consumer })
