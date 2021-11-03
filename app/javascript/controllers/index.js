// Load all the controllers within this directory and all subdirectories. 
// Controller files must be named *_controller.js.

import { application } from "./application"
import StimulusReflex from 'stimulus_reflex'
import consumer from '../channels/consumer'
import controller from './application_controller'
import CableReady from 'cable_ready'

// TODO fix these comoponents not working

// import { Alert, Dropdown, Modal } from "tailwindcss-stimulus-components"
// application.register('dropdown', Dropdown)
// application.register('alert', Alert)
// application.register('modal', Modal)

import NestedForm from "stimulus-rails-nested-form"
application.register("nested-form", NestedForm)

application.consumer = consumer

StimulusReflex.initialize(application, { consumer, controller, isolate: true })
StimulusReflex.debug = process.env.RAILS_ENV === 'development'

CableReady.initialize({ consumer })
