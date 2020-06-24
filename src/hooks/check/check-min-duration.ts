// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post } from '../../declarations'
import { BadRequest } from '@feathersjs/errors'

/**
 * Check that the duratio is greater than 30
 */
export default (minDuration = 30): Hook => {
  return async (context: HookContext<Post>) => {
    const { data } = context

    if (data?.duration && data.duration < minDuration) {
      throw new BadRequest(`duration must be greater than ${minDuration}`)
    }
    return context
  }
}
