// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { PostType, Subscription, Post } from '../../declarations'
import { BadRequest } from '@feathersjs/errors'

/**
 * Check that the type of the post is the type that user can subscribe (using the option)
 * @param {PostType} type
 */
export default (type: PostType): Hook => {
  return async (context: HookContext<Subscription>) => {
    const { params } = context

    if ((params.post as Post).type !== type) {
      throw new BadRequest(
        `you can't subscribe to this type of post: '${
          (params.post as Post).type
        }'`
      )
    }

    return context
  }
}
