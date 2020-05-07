// Initializes the `subjects` service on path `/subjects`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Subjects } from './subjects.class'
import createModel from '../../models/subjects.model'
import hooks from './subjects.hooks'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    subjects: Subjects & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  let subjects: Subjects & { docs?: object }
  // Create service with any options it requires
  subjects = new Subjects(options, app)

  // Create documentation
  subjects.docs = yml('subjects.doc.yml')

  // Initialize our service
  app.use('/subjects', subjects)

  // Get our initialized service so that we can register hooks
  const service = app.service('subjects')

  service.hooks(hooks)
}
