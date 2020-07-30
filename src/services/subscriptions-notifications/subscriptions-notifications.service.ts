// Initializes the `subscriptionsNotifications` service on path `/subscriptions-notifications`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { SubscriptionsNotifications } from './subscriptions-notifications.class'
import createModel from '../../models/subscriptions-notifications.model'
import hooks from './subscriptions-notifications.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'subscriptions-notifications': SubscriptionsNotifications &
      ServiceAddons<any>
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use(
    '/subscriptions-notifications',
    new SubscriptionsNotifications(options, app)
  )

  // Get our initialized service so that we can register hooks
  const service = app.service('subscriptions-notifications')

  service.hooks(hooks)
}
