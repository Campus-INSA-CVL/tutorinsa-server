// Initializes the `subjects` service on path `/subjects`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Subjects } from './subjects.class'
import createModel from '../../models/subjects.model'
import hooks from './subjects.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    subjects: Subjects & ServiceAddons<any>
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/subjects', new Subjects(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('subjects')

  service.hooks(hooks)
}
