// Initializes the `departments` service on path `/departments`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Departments } from './departments.class'
import createModel from '../../models/departments.model'
import hooks from './departments.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    departments: Departments & ServiceAddons<any>
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/departments', new Departments(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('departments')

  service.hooks(hooks)
}
