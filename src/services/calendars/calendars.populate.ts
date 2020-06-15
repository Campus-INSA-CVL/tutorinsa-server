import { HookContext, Service } from '@feathersjs/feathers'
import BatchLoader from '@feathers-plus/batch-loader'
import { callingParams } from 'feathers-hooks-common'

import { ServiceTypes, Calendar, CalendarCore } from '../../declarations'
import logger from '../../logger'

const { getResultsByKey, getUniqueKeys } = BatchLoader

type LoaderContext = HookContext & {
  _loaders: {
    room: { id: BatchLoader<string, object, HookContext<any, Service<any>>> }
    post: {
      id: BatchLoader<string, object, HookContext<any, Service<any>>>
    }
  }
}

/**
 * Create batch-loader to populate data
 * @param {HookContext} context
 * @param {keyof ServiceTypes} serviceName
 * @returns {BatchLoader}
 */
function createBatchLoader(
  context: HookContext,
  serviceName: keyof ServiceTypes
) {
  return new BatchLoader(
    async (keys: string[], ctx: HookContext) => {
      const { app } = ctx
      let result
      try {
        result = await app.service(serviceName).find(
          callingParams({
            query: { _id: { $in: getUniqueKeys(keys) } },
            propNames: ['user', 'authentication', 'ability'],
            newProps: { provider: 'external' },
          })(context)
        )
      } catch (error) {
        logger.debug(error)
        return getResultsByKey(keys, [], (data) => data._id, '!')
      }
      if (result.data) {
        return getResultsByKey(keys, result.data, (data) => data._id, '!')
      } else {
        return getResultsByKey(keys, result, (data) => data._id, '!')
      }
    },
    { context }
  )
}
/**
 *
 * @param {LoaderContext} context
 * @param {keyof LoaderContext['_loaders']} loader
 * @param {Calendar} calendar
 * @param {keyof CalendarCore} from
 * @param {keyof CalendarCore} to
 * @returns {Promise<User>}
 */
async function joinId(
  context: LoaderContext,
  loader: keyof LoaderContext['_loaders'],
  calendar: Calendar,
  from: keyof CalendarCore,
  to: keyof CalendarCore
): Promise<CalendarCore> {
  if (calendar[from]) {
    const isArray = Array.isArray(calendar[from])
    try {
      let data: object | object[]
      if (isArray) {
        data = await context._loaders[loader].id.loadMany(
          (calendar[from] as unknown) as string[]
        )
        data = (data as object[]).filter((el) => el !== null)
      } else {
        data = await context._loaders[loader].id.load(calendar[from] as string)
        if (data == null) {
          data = {}
        }
      }
      // @ts-ignore
      calendar[to] = data
    } catch (error) {
      logger.error(error)
      // @ts-ignore
      calendar[to] = {}
    }
    return calendar
  } else {
    return calendar
  }
}

export default {
  before: (context: LoaderContext) => {
    context._loaders = {
      room: { id: createBatchLoader(context, 'rooms') },
      post: { id: createBatchLoader(context, 'posts') },
    }
  },
  joins: {
    year: () => async (calendar: Calendar, context: LoaderContext) =>
      await joinId(context, 'room', calendar, 'roomId', 'room'),
  },
}
