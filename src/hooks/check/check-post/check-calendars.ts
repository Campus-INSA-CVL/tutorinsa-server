// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import {
  Hook,
  HookContext,
  Paginated,
  Application,
  Id,
} from '@feathersjs/feathers'
import { Post, Room, Calendar, Slot } from '../../../declarations'
import { GeneralError, BadRequest } from '@feathersjs/errors'
import { createSlots } from '../../../services/calendars/calendars.functions'

/**
 * Check that slots wanted by a post are availbe in the calendar
 * @param {Calendar} calendar
 * @param {Slot[]} postSlots
 */
function checkAvaibilitySlots(calendar: Calendar, postSlots: Slot[]) {
  if (!calendar.slots) {
    return
  }

  calendar.slots.forEach((calendarSlot) => {
    const startAtCalendarSlot = new Date(calendarSlot.startAt)

    postSlots.forEach((postSlot) => {
      const startAtPostSlot = new Date(postSlot.startAt)

      if (
        startAtCalendarSlot.getHours() === startAtPostSlot.getHours() &&
        startAtCalendarSlot.getMinutes() === startAtPostSlot.getMinutes() &&
        calendarSlot.occupied === true
      ) {
        throw new BadRequest(
          `the slot at ${startAtCalendarSlot.getUTCHours()}:${startAtCalendarSlot.getUTCMinutes()} is not available`
        )
      }
    })
  })
}

/**
 * Check that the calendar is available
 */
export default (options = {}): Hook => {
  return async (
    context: HookContext<Post & { room: Room; calendar: Calendar }>
  ) => {
    const { data, method } = context

    if (data) {
      if (!data.room) {
        throw new GeneralError('no room provided to check calendars')
      }

      if (data.calendar) {
        switch (method) {
          case 'create':
            const postSlots = createSlots(data.startAt!, data.duration!)

            checkAvaibilitySlots(data.calendar, postSlots)

            break
          // case 'patch':
          //   break
          /* istanbul ignore next */
          default:
            break
        }
      }
    }
    return context
  }
}
