// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Id } from '@feathersjs/feathers'
import { BadRequest, GeneralError } from '@feathersjs/errors'
import mongoose from 'mongoose'
import { Subscription, Post, Application } from '../../declarations'

/**
 * Get a post using his id
 * @param {Id} postId
 * @param {Application} app
 * @returns {Promise<Post>}
 */
async function getPost(postId: Id, app: Application): Promise<Post> {
  let post: Post
  try {
    post = await app.service('posts').get(postId, {})
  } catch (e) {
    throw new GeneralError('get post encountered an error')
  }
  return post
}

/**
 * Check if a value is a string and an objectId
 * @param value which will test by the regex
 * @returns boolean
 */
function checkObjectId(value: unknown): boolean {
  return typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)
}

export default (options = {}): Hook => {
  return async (context: HookContext<Subscription>) => {
    const { id, params, app } = context

    if (id && checkObjectId(id)) {
      params.post = await getPost(id, app as Application)
    } else {
      throw new BadRequest(`'${id}' is not a correct id`)
    }

    return context
  }
}
