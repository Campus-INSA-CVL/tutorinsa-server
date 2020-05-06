// Initializes the `years` service on path `/years`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Years } from './years.class'
import createModel from '../../models/years.model'
import hooks from './years.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    years: Years & ServiceAddons<any>
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/years', new Years(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('years')

  service.hooks(hooks)
}
