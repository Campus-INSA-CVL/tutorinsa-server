// Initializes the `calendar` service on path `/calendar`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Calendar } from './calendar.class'
import createModel from '../../models/calendar.model'
import hooks from './calendar.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    calendar: Calendar & ServiceAddons<any>
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/calendar', new Calendar(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('calendar')

  service.hooks(hooks)
}
