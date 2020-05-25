// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post, Application, Room, Calendar } from '../declarations'
import { GeneralError } from '@feathersjs/errors'

/**
 * Create a calendar
 * @param {Application} app the application
 * @param {{ post: Post; room: Room }} data used to the service to create the application
 * @returns {Promise<Calendar>}
 */
async function createCalendar(
  app: Application,
  data: { post: Post; room: Room }
): Promise<Calendar> {
  return await app.service('calendars').create(data, {})
}

/**
 * Create a calendar
 */
export default (options = {}): Hook => {
  return async (
    context: HookContext<Post & { calendar?: Calendar; room?: Room }>
  ) => {
    const { app, data, result } = context

    if (data) {
      if (!data.room) {
        throw new GeneralError('no room found to create a calendar')
      }

      if (!data.calendar) {
        await createCalendar(app as Application, {
          post: result as Post,
          room: data.room,
        })
      }
    }

    return context
  }
}
