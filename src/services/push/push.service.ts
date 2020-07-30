// Initializes the `push` service on path `/push`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Push } from './push.class'
import hooks from './push.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    push: Push & ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/push', new Push(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('push')

  service.hooks(hooks)
}
