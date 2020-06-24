// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Paginated } from '@feathersjs/feathers'
import { Post, Room } from '../../../declarations'
import moment from '../../../utils/moment'
import { GeneralError, BadRequest } from '@feathersjs/errors'

/**
 * Check that the room wanted by a post
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Post & { room: Room }>) => {
    const { data, app, params, id, method } = context

    if (data) {
      if (params?.room) {
        // If it's a patch, startAt can be unchanged
        const startAtPost = data.startAt ?? (params.post as Post).startAt
        const room = params.room as Room

        const query = {
          roomId: room._id?.toString(),
          startAt: {
            $gte: moment.utc(startAtPost).hours(0).minutes(0),
            $lte: moment.utc(startAtPost).add(1, 'day').hours(0).minutes(0),
          },
        }

        let results: Paginated<Post>
        try {
          results = await app.service('posts').find({ query })
        } catch (e) {
          throw new GeneralError('unable to fetch posts')
        }

        if (results.total) {
          if (
            method === 'create' ||
            results.data[0]._id?.toString() !== id?.toString()
          ) {
            throw new BadRequest(
              `can't create a post with this room '${room.name}' at '${startAtPost}' because there is already a post for this room at this time`
            )
          }
        }
      }
    }

    return context
  }
}
