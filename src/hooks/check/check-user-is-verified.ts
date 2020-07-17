import { ForbiddenError } from '@casl/ability'
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { User } from '../../declarations'

/**
 * Check that a user have verified is account to respond with the web token
 */
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { params } = context
    const { user } = params

    if (user && !(user as User).isVerified) {
      throw new Forbidden('You must verified your account')
    }
    return context
  }
}
