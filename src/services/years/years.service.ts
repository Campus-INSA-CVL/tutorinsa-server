// Initializes the `years` service on path `/years`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Years } from './years.class'
import createModel from '../../models/years.model'
import hooks from './years.hooks'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    years: Years & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  let years: Years & { docs?: object }
  // Create service with any options it requires
  years = new Years(options, app)

  // Create documentation
  years.docs = yml('years.doc.yml')

  // Initialize our service
  app.use('/years', years)

  // Get our initialized service so that we can register hooks
  const service = app.service('years')

  service.hooks(hooks)
}
