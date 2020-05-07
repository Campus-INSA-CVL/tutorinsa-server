// Initializes the `departments` service on path `/departments`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Departments } from './departments.class'
import createModel from '../../models/departments.model'
import hooks from './departments.hooks'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    departments: Departments & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  let departments: Departments & { docs?: object }
  // Create service with any options it requires
  departments = new Departments(options, app)

  // Create documentation
  departments.docs = yml('subjects.doc.yml')

  // Initialize our service with any options it requires
  app.use('/departments', departments)

  // Get our initialized service so that we can register hooks
  const service = app.service('departments')

  service.hooks(hooks)
}
