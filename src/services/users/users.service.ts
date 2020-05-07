// Initializes the `users` service on path `/users`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Users } from './users.class'
import createModel from '../../models/users.model'
import hooks from './users.hooks'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    users: Users & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  let users: Users & { docs?: object }
  // Create service with any options it requires
  users = new Users(options, app)

  // Create documentation
  users.docs = yml('users.doc.yml')

  // Initialize our service with any options it requires
  app.use('/users', users)

  // Get our initialized service so that we can register hooks
  const service = app.service('users')

  service.hooks(hooks)
}
