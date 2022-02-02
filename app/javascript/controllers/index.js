import { application } from "./application"
import StimulusReflex from 'stimulus_reflex'
import consumer from '../channels/consumer'
import controller from './application_controller'
import CableReady from 'cable_ready'
import debounced from  'debounced'

debounced.initialize()

import CommentsFormComponent from "../../components/comments/form/component_controller.js"
import CategoriesCardComponent from "../../components/categories/card/component_controller.js"
import ScriptsCardCopyComponent from "../../components/scripts/card/copy_button/component_controller.js"
application.register("comments--form--component", CommentsFormComponent)
application.register("categories--card--component", CategoriesCardComponent)
application.register("scripts--card--copy--component", ScriptsCardCopyComponent )

import AvatarPreview from "./avatar_preview_controller"
import Attachments from "./attachments_controller"
application.register("avatar-preview", AvatarPreview)
application.register("attachments", Attachments)

import { Alert, Dropdown, Modal, Toggle } from "tailwindcss-stimulus-components"

application.register('dropdown', Dropdown)
application.register('alert', Alert)
application.register('modal', Modal)
application.register('toggle', Toggle)

application.consumer = consumer

StimulusReflex.initialize(application, { controller, isolate: true })
// StimulusReflex.debug = true
CableReady.initialize({ consumer })
