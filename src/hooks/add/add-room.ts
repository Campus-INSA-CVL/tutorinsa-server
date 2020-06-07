// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Application, Id } from '@feathersjs/feathers'
import { Room, Post } from '../../declarations'
import { GeneralError, BadRequest } from '@feathersjs/errors'

/**
 * Get the room using the roomId
 * @param {Application} app
 * @param {Id} roomId
 * @returns The room
 */
async function getRoom(app: Application, roomId: Id): Promise<Room> {
  let room: Room
  try {
    room = (await app.service('rooms').get(roomId)) as Room
  } catch (error) {
    throw new GeneralError('impossible to add a room to data')
  }
  return room
}

/**
 * Get a post using the id
 * @param {Application} app
 * @param {Id} postId
 * @returns The post
 */
async function getPost(app: Application, postId: Id): Promise<Post> {
  let post: Post
  try {
    post = (await app.service('posts').get(postId)) as Post
  } catch (error) {
    throw new GeneralError('impossible to get post')
  }
  return post
}

/**
 * Add a room to the data using the room id
 */
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, data, method, id } = context

    if (data?.roomId) {
      data.room = await getRoom(app, data.roomId)
    } else if (method === 'remove') {
      if (!id) {
        throw new BadRequest('an id is required to add a room')
      }
      const post = await getPost(app, id)
      context.data = {}
      context.data.startAt = post.startAt
      context.data.room = await getRoom(app, post.roomId as Id)
    }
    return context
  }
}
