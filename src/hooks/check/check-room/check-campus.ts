// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Room, Campus } from '../../../declarations'
import { BadRequest } from '@feathersjs/errors'

const campus: Campus[] = ['bourges', 'blois']

/**
 * Check that the campus field is correct
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Room>) => {
    const { data } = context

    if (data?.campus) {
      if (!campus.includes(data.campus.toLowerCase() as Campus)) {
        throw new BadRequest(`${data.campus} is unknown`)
      }
    }

    return context
  }
}
