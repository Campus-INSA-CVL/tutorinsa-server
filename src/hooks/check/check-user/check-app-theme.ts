// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import { User } from '../../../declarations'

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { data } = context

    if ((data as User)?.appTheme) {
      if (typeof (data as User).appTheme !== 'string') {
        throw new BadRequest(`'appTheme' must be a string`)
      }
    }

    return context
  }
}
