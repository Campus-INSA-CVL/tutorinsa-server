// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post, PostType } from '../../../declarations'
import { BadRequest } from '@feathersjs/errors'

export default (options: PostType[]): Hook => {
  return async (context: HookContext<Post>) => {
    const { data } = context

    if (data?.type) {
      if (!options.includes(data.type)) {
        throw new BadRequest(`${data.type} is an incorrect type of post`)
      }
    }

    return context
  }
}
