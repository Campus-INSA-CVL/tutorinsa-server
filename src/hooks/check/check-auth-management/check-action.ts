// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import { Action } from '../../../declarations'

/**
 * Check that an action is authorized
 */
export default (authorizedActions: Action[]): Hook => {
  return async (context: HookContext) => {
    const { data } = context

    if (data && !authorizedActions.includes(data.action)) {
      throw new BadRequest(`'${data.action}' is not an authorized action`)
    }

    return context
  }
}
