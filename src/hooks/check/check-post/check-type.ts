// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post, PostType } from '../../../declarations'
import { BadRequest } from '@feathersjs/errors'

/**
 * Check that the content of a field of data is in an array
 * @param {string}
 * @param {string[]}
 */
export default (fieldName: string, types: string[]): Hook => {
  return async (context: HookContext<Post>) => {
    const { data } = context

    if (data?.type) {
      const field = data[fieldName]
      if (
        field &&
        typeof field !== 'number' &&
        !Array.isArray(field) &&
        typeof field === 'string'
      ) {
        if (!types.includes(field)) {
          throw new BadRequest(`${field} is an incorrect type`)
        }
      }
    }

    return context
  }
}
