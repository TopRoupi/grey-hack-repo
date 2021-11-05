import { application } from "./application"
import StimulusReflex from 'stimulus_reflex'
import consumer from '../channels/consumer'
import controller from './application_controller'
import CableReady from 'cable_ready'

import CommentsFormComponent from "../../components/comments/form/component_controller.js"
import ScriptsCardComponent from "../../components/scripts/card/component_controller.js"
import CategoriesCardComponent from "../../components/categories/card/component_controller.js"
application.register("scripts--card--component", ScriptsCardComponent)
application.register("comments--form--component", CommentsFormComponent)
application.register("categories--card--component", CategoriesCardComponent)

import AvatarPreview from "./avatar_preview_controller"
application.register("avatar-preview", AvatarPreview)

import { Alert, Dropdown, Modal } from "tailwindcss-stimulus-components"
application.register('dropdown', Dropdown)
application.register('alert', Alert)
application.register('modal', Modal)

import NestedForm from "stimulus-rails-nested-form"
application.register("nested-form", NestedForm)

application.consumer = consumer

StimulusReflex.initialize(application, { controller, isolate: true })
StimulusReflex.debug = true

CableReady.initialize({ consumer })
