// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post } from '../../../declarations'
import { BadRequest } from '@feathersjs/errors'
import moment from '../../../utils/moment'

/**
 * Check that the value is after today
 * @param value
 * @returns boolean
 */
function isAfter(value: string): boolean {
  return moment().diff(value) < 0
}

/**
 * Check that a date is greater than today
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Post>) => {
    const { data } = context

    if (data?.startAt) {
      if (!isAfter(data.startAt)) {
        throw new BadRequest("can't register with a date in the past")
      }
    }

    return context
  }
}
