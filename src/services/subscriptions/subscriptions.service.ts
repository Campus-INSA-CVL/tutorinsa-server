// Initializes the `subscriptions` service on path `/subscriptions`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Subscriptions } from './subscriptions.class'
import hooks from './subscriptions.hooks'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    subscriptions: Subscriptions & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate'),
  }

  let subscriptions: Subscriptions & {
    docs?: object
  }

  // Create service with any options it requires
  // @ts-ignore
  subscriptions = new Subscriptions(options, app)

  // Create documentation
  subscriptions.docs = yml('subscriptions.doc.yml')

  // Initialize our service with any options it requires
  app.use('/subscriptions', subscriptions)

  // Get our initialized service so that we can register hooks
  const service = app.service('subscriptions')

  service.hooks(hooks)
}
