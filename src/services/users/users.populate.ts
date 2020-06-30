import { HookContext, Service } from '@feathersjs/feathers'
import BatchLoader from '@feathers-plus/batch-loader'
import { callingParams } from 'feathers-hooks-common'

import { User, ServiceTypes, UserCore } from '../../declarations'
import logger from '../../logger'

const { getResultsByKey, getUniqueKeys } = BatchLoader

type LoaderContext = HookContext & {
  _loaders: {
    year: { id: BatchLoader<string, object, HookContext<any, Service<any>>> }
    department: {
      id: BatchLoader<string, object, HookContext<any, Service<any>>>
    }
    subject: {
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
            query: {
              _id: { $in: getUniqueKeys(keys) },
              $limit: app.get('paginate').max,
            },
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
 * @param {User} user
 * @param {keyof UserCore} from
 * @param {keyof UserCore} to
 * @returns {Promise<User>}
 */
async function joinId(
  context: LoaderContext,
  loader: keyof LoaderContext['_loaders'],
  user: User,
  from: keyof UserCore,
  to: keyof UserCore
): Promise<User> {
  if (user[from]) {
    const isArray = Array.isArray(user[from])
    try {
      let data: object | object[]
      if (isArray) {
        data = await context._loaders[loader].id.loadMany(
          user[from] as string[]
        )
        data = (data as object[]).filter((el) => el !== null)
      } else {
        data = await context._loaders[loader].id.load(user[from] as string)
        if (data == null) {
          data = {}
        }
      }
      // @ts-ignore
      user[to] = data
    } catch (error) {
      logger.error(error)
      // @ts-ignore
      user[to] = {}
    }
    return user
  } else {
    return user
  }
}

export default {
  before: (context: LoaderContext) => {
    context._loaders = {
      year: { id: createBatchLoader(context, 'years') },
      department: { id: createBatchLoader(context, 'departments') },
      subject: { id: createBatchLoader(context, 'subjects') },
    }
  },
  joins: {
    year: () => async (user: User, context: LoaderContext) =>
      await joinId(context, 'year', user, 'yearId', 'year'),
    department: () => async (user: User, context: LoaderContext) =>
      await joinId(context, 'department', user, 'departmentId', 'department'),
    favoriteSubjects: () => async (user: User, context: LoaderContext) =>
      await joinId(
        context,
        'subject',
        user,
        'favoriteSubjectsIds',
        'favoriteSubjects'
      ),
    difficultSubjects: () => async (user: User, context: LoaderContext) =>
      await joinId(
        context,
        'subject',
        user,
        'difficultSubjectsIds',
        'difficultSubjects'
      ),
  },
}
