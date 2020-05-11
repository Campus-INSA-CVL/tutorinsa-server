// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { User } from '../../declarations'
import validator from 'validator'
import { BadRequest } from '@feathersjs/errors'

/**
 * Check that the email is correct
 */
export default (options = {}): Hook => {
  return async (context: HookContext<User>) => {
    const { data } = context

    if (data?.email) {
      data.email = data.email.toLowerCase()

      if (!validator.isEmail(data.email)) {
        throw new BadRequest('must be a valid email')
      }

      const regex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@insa-cvl\.fr$/
      )

      if (!regex.test(data.email)) {
        throw new BadRequest('must be an INSA email')
      }
    }

    return context
  }
}
