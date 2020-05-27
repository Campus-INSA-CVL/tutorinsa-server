// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import {
  Hook,
  HookContext,
  Paginated,
  Application,
  Id,
} from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'

import { Calendar, Post, Room } from '../../declarations'
import { createConcatDate } from '../../services/calendars/calendars.functions'

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
 * Add a calendar using the room._id
 */
export default (options = {}): Hook => {
  return async (
    context: HookContext<Post & { room: Room; calendar?: Calendar }>
  ) => {
    const { data, app } = context

    if (data?.startAt) {
      if (!data.room) {
        throw new GeneralError('no room provided to add a calendar')
      }

      const concateDate = createConcatDate(data.startAt, data.room.startAt)

      data.calendar = await getCalendar(data.room._id!, concateDate, app)
    }

    return context
  }
}
