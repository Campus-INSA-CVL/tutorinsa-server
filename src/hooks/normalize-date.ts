// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import moment from '../utils/moment'
import { BadRequest } from '@feathersjs/errors'

/**
 * Normalize date to an ISO string
 */
export default (options: string[] = []): Hook => {
  return async (context: HookContext) => {
    const { data } = context

    if (data && options.length) {
      options.forEach((key) => {
        // Find the field in the data
        if (data[key]) {
          // Date unvalide
          if (!moment(new Date(data[key])).isValid()) {
            throw new BadRequest(`'${data[key]}' is not a valid date`)
          } else {
            context.data[key] = new Date(data[key]).toISOString()
          }
        }
      })
    }
    return context
  }
}
