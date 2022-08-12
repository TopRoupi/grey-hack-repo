import ApplicationController from './application_controller'
import CableReady from 'cable_ready'

/*
Example usage:
```html
<div data-controller="cable-from" data-cable-from-key-value="test"></div>
 */
export default class extends ApplicationController {
    static values = {
        key: String,
    }

    connect() {
      super.connect()
      console.log("testeeee")
      console.log(this.application.consumer)
      console.log(this.keyValue)
      this.channel = this.application.consumer.subscriptions.create(
        {
          channel: "ApplicationChannel",
        },
        {
          received (data) {
            console.log("received")
            if (data.cableReady) CableReady.perform(data.operations)
          }
        }
      )
    }

    disconnect() {
    }
}
