// Initializes the `authManagement` service on path `/auth-management`
import { ServiceAddons, ServiceMethods } from '@feathersjs/feathers'
// @ts-ignore
import authManagement from 'feathers-authentication-management'
import { Application } from '../../declarations'
import hooks from './auth-management.hooks'
import notifier from './notifier'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    authManagement: ServiceMethods<{}> & ServiceAddons<any>
  }
}

export default function (app: Application) {
  const docs = yml('authManagement.doc.yml')

  // Initialize our service with any options it requires
  app.configure(authManagement(notifier(app), docs))

  // Get our initialized service so that we can register hooks
  const service = app.service('authManagement')

  service.hooks(hooks)
}
