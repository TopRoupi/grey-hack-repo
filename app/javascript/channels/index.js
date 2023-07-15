// Load all the channels within this directory and all subdirectories.
import * as Futurism from '@stimulus_reflex/futurism'
import consumer from '../channels/consumer'
// Channel files must be named *_channel.js.

// const channels = require.context(".", true, /_channel\.js$/)
// channels.keys().forEach(channels)
Futurism.initializeElements()
Futurism.createSubscription(consumer)
