// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import { Post } from '../../../declarations'

import moment from '../../../utils/moment'
/**
 * Check that the day of the post is the same that the day of the room
 * @param {string} startAtPost a date
 * @param {string} dayRoom a weekday
 * @returns {boolean}
 */
function isSameDay(startAtPost: string, dayRoom: string): boolean {
  return moment.weekdays()[new Date(startAtPost).getUTCDay()] === dayRoom
}

/**
 * Check that the day of the post is the same that the day of the room
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Post>) => {
    const { data, params } = context

    const roomDay = params.room?.day
    const postStartAt = data?.startAt ?? params.post?.startAt

    if (roomDay && postStartAt) {
      if (!isSameDay(postStartAt, roomDay)) {
        throw new BadRequest(
          `day of post (${
            moment.weekdays()[new Date(postStartAt).getUTCDay()]
          }) and the room (${roomDay}) must be the same`
        )
      }
    }

    return context
  }
}
