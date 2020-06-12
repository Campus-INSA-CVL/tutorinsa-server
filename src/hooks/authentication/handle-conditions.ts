// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { callingParams } from 'feathers-hooks-common'
import { subject, ForbiddenError } from '@casl/ability'
import { toMongoQuery } from '@casl/mongoose'
import util from 'util'

import logger from '../../logger'

/**
 * Add permissions to query
 */
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { id, method, path, params, app, data } = context
    const { ability } = params

    if (ability) {
      if (!id) {
        if (method === 'find') {
          const query = toMongoQuery(ability, path, method)
          logger.debug(`query: ${util.inspect(query, false, 10, true)}`)
          if (query) {
            Object.assign(params.query, query)
          }
        }
        if (data && method === 'create') {
          if (!ability.can(method, subject(path, data))) {
            throw new Forbidden(`You are not allowed to ${method} on ${path}`)
          }
        }
      } else {
        const result = await app.service(path).get(
          id,
          callingParams({
            propNames: ['user', 'authenticated', 'ability'],
            newProps: { provider: null },
          })(context)
        )
        if (!ability.can(method, subject(path, result))) {
          throw new Forbidden(`You are not allowed to ${method} on ${path}`)
        }
      }
    }

    return context
  }
}
