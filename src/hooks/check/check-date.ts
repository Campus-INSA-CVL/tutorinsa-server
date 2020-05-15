// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Room } from '../../declarations'
import moment from '../../utils/moment'
import { BadRequest } from '@feathersjs/errors'

/**
 * Check if minutes is 00 or 30
 * @param minutes
 * @returns boolean
 */
function correctMinutes(minutes: number): boolean {
  return /^(0|3)?0$/.test(minutes.toString())
}

/**
 * Check that duration is a multiple of 30
 * @param duration
 * @returns boolean
 */
function correctDuration(duration: number): boolean {
  return !(duration % 30)
}

/**
 * Check time fields
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Room>) => {
    const { data } = context

    if (data) {
      const keys = Object.keys(data)

      keys.forEach((key) => {
        switch (key) {
          case 'startAt':
            const minutes = moment(new Date(data[key])).minutes()
            if (!correctMinutes(minutes)) {
              throw new BadRequest('minutes must be 00 or 30')
            }
            break
          case 'duration':
            const duration = data[key]
            if (!correctDuration(duration)) {
              throw new BadRequest('duration must be a multiple of 30')
            }
            break
          default:
            break
        }
      })
    }

    return context
  }
}
