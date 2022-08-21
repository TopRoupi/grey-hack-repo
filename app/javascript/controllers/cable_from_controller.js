import ApplicationController from "./application_controller"
import CableReady from "cable_ready"

/*
Example usage:
```html
<div data-controller="cable-from" data-cable-from-id-value="test"></div>
 */
export default class extends ApplicationController {
  static values = {
    id: String,
  }

  connect() {
    this.channel = this.application.consumer.subscriptions.create(
      {
        channel: "ApplicationChannel",
        id: this.idValue,
      },
      {
        received (data) {
          if (data.cableReady) CableReady.perform(data.operations)
        }
      }
    )
  }

  disconnect() {
  }
}
