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
import {
  createSlots,
  createConcatDate,
} from '../../../services/calendars/calendars.functions'

/**
 * Get a calendar using the roomId and a specific date
 * @param {Id} roomId
 * @param {string} date
 * @param {Application} app
 * @returns {Promise<Calendar>} A calendar
 */
async function getCalendar(
  roomId: Id,
  startAt: string,
  app: Application
): Promise<Calendar> {
  let calendars: Paginated<Calendar>
  try {
    calendars = await app.service('calendars').find({
      query: { roomId, startAt: { $gte: startAt } },
    })
  } catch (e) {
    throw new GeneralError('find calendars encountered an error')
  }

  return calendars.data[0]
}

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
    context: HookContext<Post & { room: Room; calendar: Calendar | undefined }>
  ) => {
    const { data, app, method } = context

    if (data) {
      if (!data.room) {
        throw new GeneralError('no room provided to check calendars')
      }

      const concateDate = createConcatDate(data.startAt, data.room.startAt)

      data.calendar = await getCalendar(data.room._id!, concateDate, app)

      if (data.calendar) {
        switch (method) {
          case 'create':
            const postSlots = createSlots(data.startAt, data.duration)

            checkAvaibilitySlots(data.calendar, postSlots)

            break
          case 'patch':
            break

          default:
            break
        }
      }
    }
    return context
  }
}
