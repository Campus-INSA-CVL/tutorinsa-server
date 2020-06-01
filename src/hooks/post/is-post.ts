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
    const { data } = context

    if (data) {
      if (!data?.type) {
        throw new BadRequest(`a type is required`)
      }
      return data.type === options
    }
    return false
  }
}
