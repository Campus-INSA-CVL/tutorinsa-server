// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import { Post, PostType } from '../../declarations'

/**
 * Return a boolean depanding of the type used
 */
export default (options: PostType): ((hook: HookContext) => boolean) => {
  return (context: HookContext<Post>) => {
    const { data, params } = context

    if (!data?.type && !(params.post as Post)?.type) {
      throw new BadRequest(`a type is required`)
    } else {
      const type = data?.type ?? (params.post as Post)?.type
      return type === options
    }
    return false
  }
}
