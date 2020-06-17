// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Id, Params } from '@feathersjs/feathers'
import { BadRequest, GeneralError } from '@feathersjs/errors'
import mongoose from 'mongoose'
import { Subscription, Post, Application } from '../../declarations'
import { callingParams } from 'feathers-hooks-common'

/**
 * Get a post using his id
 * @param {Id} postId
 * @param {HookContext} context
 * @returns {Promise<Post>}
 */
async function getPost(postId: Id, context: HookContext): Promise<Post> {
  let post: Post
  try {
    post = await context.app.service('posts').get(
      postId,
      callingParams({
        propNames: ['user', 'authenticated', 'ability'],
        newProps: { provider: null },
      })(context)
    )
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
      params.post = await getPost(id, context)
    } else {
      throw new BadRequest(`'${id}' is not a correct id`)
    }

    return context
  }
}
