// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post } from '../declarations'

/**
 * Remove some fields in data
 * @param fields
 * @param data
 * @return Post
 */
function removeFields(fields: string[], data: Post): Post {
  fields.forEach((field) => {
    delete data[field]
  })
  return data
}

/**
 * Remove unwanted fields in data passed through options
 * @param options
 */
export default (options?: string[]): Hook => {
  return async (context: HookContext<Post>) => {
    const { data } = context

    if (data && options?.length) {
      context.data = removeFields(options, data)
    }

    return context
  }
}
