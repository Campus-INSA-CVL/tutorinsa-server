// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post, Room, Application, Calendar } from '../../declarations'
import { GeneralError } from '@feathersjs/errors'

/**
 *
 * @param {Application} app
 * @param {Post} post
 * @param {Calendar} calendar
 * @param {HookContext['method']} method is used to know if want to add or remove post
 */
async function patchCalendar(
  app: Application,
  post: Post,
  calendar: Calendar,
  method: HookContext['method']
) {
  try {
    await app
      .service('calendars')
      .patch(calendar._id!, { post, calendar }, { from: method })
  } catch (e) {
    throw new GeneralError("the calendar can't be patched")
  }
}

/**
 * Patch a calendar
 */
export default (options: HookContext['method']): Hook => {
  return async (
    context: HookContext<Post & { calendar?: Calendar; room?: Room }>
  ) => {
    const { app, data, result, method } = context

    if (data?.calendar?._id) {
      await patchCalendar(app as Application, result!, data.calendar, options)
    }
    return context
  }
}
