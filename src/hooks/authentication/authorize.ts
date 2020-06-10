// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { ForbiddenError } from '@casl/ability'

import defineAbilitiesFor, { Services } from './ability'

ForbiddenError.setDefaultMessage(
  (error) => `You are not allowed to ${error.action} on ${error.subjectType}`
)

/**
 * Check if a user can access to a ressource
 */
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { params, method, path } = context
    const { user } = params

    const ability = defineAbilitiesFor(user)
    params.ability = ability

    try {
      ForbiddenError.from(ability).throwUnlessCan(method, path as Services)
    } catch (error) {
      throw new Forbidden(error)
    }

    return context
  }
}
