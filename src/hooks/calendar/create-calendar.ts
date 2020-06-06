// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post, Application, Room, Calendar } from '../../declarations'
import { GeneralError } from '@feathersjs/errors'

/**
 * Create a calendar
 * @param {Application} app the application
 * @param {Post} data used to the service to create the application
 */
async function createCalendar(app: Application, post: Post, room: Room) {
  try {
    await app.service('calendars').create({ post, room })
  } catch (e) {
    throw new GeneralError("the calendar can't be created")
  }
}

/**
 * Create a calendar
 */
export default (options = {}): Hook => {
  return async (
    context: HookContext<Post & { calendar?: Calendar; room: Room }>
  ) => {
    const { app, data, result } = context

    if (data) {
      /* istanbul ignore else */
      if (!data.calendar) {
        if (!data.room) {
          throw new GeneralError('no room provided')
        }
        await createCalendar(app as Application, result as Post, data.room)
      }
    }

    return context
  }
}
