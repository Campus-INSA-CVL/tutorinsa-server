// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import validator from 'validator'
import { Post } from '../../../declarations'
import { BadRequest } from '@feathersjs/errors'

/**
 * Check if the length of a string is superior to a max
 * @param value
 * @param max
 * @returns boolean
 */
function isTooLong(value: string, max: number): boolean {
  return value.length > max
}

/**
 * Check the length of comment
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Post>) => {
    const { data } = context

    if (data?.comment) {
      const max = 440
      const comment = validator.unescape(data.comment)
      if (isTooLong(comment, max)) {
        throw new BadRequest(`comment can't exceed ${max} characters`)
      } else {
        data.comment = comment
      }
    }

    return context
  }
}
