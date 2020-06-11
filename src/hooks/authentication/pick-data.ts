// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { permittedFieldsOf } from '@casl/ability/extra'
import util from 'util'
import pick from 'lodash.pick'
import logger from '../../logger'

/**
 * Extrats fields that a user can create or update from data
 */
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { data, method, params, path } = context
    const { ability } = params

    if (ability) {
      if (data) {
        const fields = permittedFieldsOf(ability, method, path)
        logger.debug(`fields pick: ${util.inspect(fields, false, 10, true)}`)
        const rawData = pick(data, fields)
        logger.debug(`raw data: ${util.inspect(rawData, false, 10, true)}`)
        context.data = rawData
      }
    }

    return context
  }
}
