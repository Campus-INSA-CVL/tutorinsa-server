// Initializes the `rooms` service on path `/rooms`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Rooms } from './rooms.class'
import createModel from '../../models/rooms.model'
import hooks from './rooms.hooks'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    rooms: Rooms & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    lean: { virtuals: true },
  }

  let rooms: Rooms & { docs?: object }
  // Create service with any options it requires
  // @ts-ignore
  rooms = new Rooms(options, app)

  // Create documentation
  rooms.docs = yml('rooms.doc.yml')

  // Initialize our service with any options it requires
  app.use('/rooms', rooms)

  // Get our initialized service so that we can register hooks
  const service = app.service('rooms')

  service.hooks(hooks)
}
