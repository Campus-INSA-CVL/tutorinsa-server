// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import { User } from '../../../declarations'

/**
 * Check that the password is strong enougth
 */
export default (options = {}): Hook => {
  return async (context: HookContext<User>) => {
    const { data } = context

    const regex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
    )

    if (
      (data?.password && !regex.test(data.password)) ||
      // Field for authManagement
      (data as any)?.value?.password
    )
      throw new BadRequest('this password is not strong enough')

    return context
  }
}
