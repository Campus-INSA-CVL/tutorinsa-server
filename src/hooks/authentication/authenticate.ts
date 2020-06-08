// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import * as feathersAuthentication from '@feathersjs/authentication'
import { NotAuthenticated, GeneralError } from '@feathersjs/errors'

const { authenticate } = feathersAuthentication.hooks

/**
 * Check if the request have a token
 * @param {HookContext} context
 */
function hasToken(context: HookContext) {
  if (context.params.headers === undefined) return false
  if (context.data === undefined) return false
  if (context.data.accessToken === undefined) return false
  return context.params.headers.authorization || context.data.accessToken
}

/**
 * Try to authenticate a user
 */
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    try {
      return await authenticate('jwt')(context)
    } catch (error) {
      if (error instanceof NotAuthenticated && !hasToken(context)) {
        return context
      }
      throw new GeneralError(error.message)
    }
  }
}
