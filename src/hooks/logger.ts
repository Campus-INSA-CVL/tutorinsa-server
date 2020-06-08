// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { FeathersError } from '@feathersjs/errors'
import util from 'util'
import logger from '../logger'

/**
 * Log message and data
 */
export default (options = {}): Hook => {
  return async (context: HookContext<FeathersError>) => {
    const { error, method, path, params, type, id, data, result } = context

    logger.info(`${method} ${path}`)

    if (type === 'before') {
      logger.debug(
        `${type} | ${method} ${path}:\nid: ${id}\ndata: ${util.inspect(
          data,
          false,
          10,
          true
        )}\nparams: ${util.inspect(params, false, 10, true)}`
      )
    }

    if (error && error instanceof FeathersError) {
      logger.error(
        `${error.code} (${error.className}): ${error.message} at '${method}' from service '${path}'`,
        { method, path, type }
      )
    }

    if (type === 'after') {
      logger.debug(
        `${type} | ${method} ${path}:\nid: ${id}\ndata: ${util.inspect(
          data,
          false,
          10,
          true
        )}\nparams: ${util.inspect(
          params,
          false,
          10,
          true
        )}\nresult: ${util.inspect(result, false, 10, true)}`
      )
    }

    return context
  }
}
