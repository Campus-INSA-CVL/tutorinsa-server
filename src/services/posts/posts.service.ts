// Initializes the `posts` service on path `/posts`
import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { Posts } from './posts.class'
import createModel from '../../models/posts.model'
import hooks from './posts.hooks'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    posts: Posts & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    lean: { virtuals: true },
  }

  let posts: Posts & { docs?: object }
  // Create service with any options it requires
  // @ts-ignore
  posts = new Posts(options, app)

  // Create documentation
  posts.docs = yml('posts.doc.yml')

  // Initialize our service with any options it requires
  app.use('/posts', posts)

  // Get our initialized service so that we can register hooks
  const service = app.service('posts')

  service.hooks(hooks)
}
