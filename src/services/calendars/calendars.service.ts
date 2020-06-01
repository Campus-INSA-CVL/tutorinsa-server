// Initializes the `calendar` service on path `/calendar`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Calendars } from './calendars.class'
import createModel from '../../models/calendars.model'
import hooks from './calendars.hooks'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    calendars: Calendars & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    lean: { virtuals: true },
  }

  let calendars: Calendars & { docs?: object }
  // Create service with any options it requires
  // @ts-ignore
  calendars = new Calendars(options, app)

  // Create documentation
  calendars.docs = yml('calendars.doc.yml')

  // Initialize our service with any options it requires
  app.use('/calendars', calendars)

  // Get our initialized service so that we can register hooks
  const service = app.service('calendars')

  service.hooks(hooks)
}
