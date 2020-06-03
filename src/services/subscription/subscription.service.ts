// Initializes the `subscription` service on path `/subscription`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Subscription } from './subscription.class'
import hooks from './subscription.hooks'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    subscription: Subscription & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate'),
  }

  let subscription: Subscription & {
    docs?: object
  }

  // Create service with any options it requires
  // @ts-ignore
  subscription = new Subscription(options, app)

  // Create documentation
  subscription.docs = yml('subscription.doc.yml')

  // Initialize our service with any options it requires
  app.use('/subscription', subscription)

  // Get our initialized service so that we can register hooks
  const service = app.service('subscription')

  service.hooks(hooks)
}
