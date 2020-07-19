import { ServiceAddons, Params } from '@feathersjs/feathers'
import {
  AuthenticationService,
  JWTStrategy,
  AuthenticationResult,
} from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { expressOauth } from '@feathersjs/authentication-oauth'
import { packRules } from '@casl/ability/extra'

import { Application } from './declarations'
import defineAbilitiesFor from './hooks/authentication/ability'

import yaml from './docs/utils/yamlLoader'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService &
      ServiceAddons<any> & { docs: object }
  }
}

class AbilitiesAuthService extends AuthenticationService {
  async getPayload(authResult: AuthenticationResult, params: Params) {
    const payload = await super.getPayload(authResult, params)
    const { user } = authResult

    if (user) {
      payload.permissions = user.permissions
      // const rules = defineAbilitiesFor(user)
      // console.log('rules:', rules)
      // @ts-ignore
      // payload.rules = packRules(rules)
    }

    return payload
  }
}

export default function (app: Application) {
  const authentication = new AbilitiesAuthService(
    app
  ) as AuthenticationService & { docs: object }

  authentication.docs = yaml('authentication.doc.yml')

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('/authentication', authentication)
  app.configure(expressOauth())
}
