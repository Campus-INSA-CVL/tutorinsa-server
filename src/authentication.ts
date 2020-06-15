import { ServiceAddons } from '@feathersjs/feathers'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { expressOauth } from '@feathersjs/authentication-oauth'

import { Application } from './declarations'

import yaml from './docs/utils/yamlLoader'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService &
      ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const authentication = new AuthenticationService(
    app
  ) as AuthenticationService & { docs: object }

  authentication.docs = yaml('authentication.doc.yml')

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('/authentication', authentication)
  app.configure(expressOauth())
}
