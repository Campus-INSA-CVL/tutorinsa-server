// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { getUniqueKeys } from '@feathers-plus/batch-loader'

/**
 * Remove duplicate data from arrays
 */
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { data } = context

    if (data) {
      Object.keys(data).forEach((key: string) => {
        if (Array.isArray(data[key])) {
          data[key] = getUniqueKeys(data[key])
        }
      })
    }

    return context
  }
}
