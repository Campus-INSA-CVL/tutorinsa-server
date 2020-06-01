// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post } from '../../../declarations'
import { BadRequest } from '@feathersjs/errors'

/**
 * Check that the value is between a inferior and superior number
 * @param inf
 * @param sup
 * @param value
 * @returns boolean
 */
function isBetween(inf: number, sup: number, value: number): boolean {
  return value > inf && value <= sup
}

/**
 * Check that value of each capacity field is correct
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Post>) => {
    const { data } = context

    if (data) {
      const keys = Object.keys(data)

      keys.forEach((key: string) => {
        let inf: number
        let sup: number
        switch (key) {
          case 'studentsCapacity':
            inf = 5
            sup = 20
            if (!isBetween(inf, sup, data[key] as number)) {
              throw new BadRequest(`${key} must be between ${inf} and ${sup}`)
            }
            break
          case 'tutorsCapacity':
            inf = 1
            sup = 5
            if (!isBetween(inf, sup, data[key] as number)) {
              throw new BadRequest(`${key} must be between ${inf} and ${sup}`)
            }
            break
          default:
            break
        }
      })
    }
    return context
  }
}
