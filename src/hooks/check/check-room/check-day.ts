// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Room } from '../../../declarations'
import moment from '../../../utils/moment'
import { BadRequest } from '@feathersjs/errors'

/**
 * Tell if the day is a weekday
 * @param day data to test
 * @returns boolean
 */
function isWeekDay(day: string): boolean {
  return moment.weekdays().includes(day)
}

/**
 * Check that the day is valid
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Room>) => {
    const { data } = context

    if (data?.day) {
      if (!isWeekDay(data.day)) {
        throw new BadRequest(`${data.day} is not a valid weeek day`)
      }
    }

    return context
  }
}
