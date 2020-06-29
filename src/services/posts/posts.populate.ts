import { HookContext, Service } from '@feathersjs/feathers'
import BatchLoader from '@feathers-plus/batch-loader'
import { callingParams } from 'feathers-hooks-common'

import { ServiceTypes, Post, PostCore } from '../../declarations'
import logger from '../../logger'

const { getResultsByKey, getUniqueKeys } = BatchLoader

type LoaderContext = HookContext & {
  _loaders: {
    subject: {
      id: BatchLoader<string, object, HookContext<any, Service<any>>>
    }
    user: { id: BatchLoader<string, object, HookContext<any, Service<any>>> }
    room: {
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
 * @param {Post} post
 * @param {keyof PostCore} from
 * @param {keyof PostCore} to
 * @returns {Promise<Post>}
 */
async function joinId(
  context: LoaderContext,
  loader: keyof LoaderContext['_loaders'],
  post: Post,
  from: keyof PostCore,
  to: keyof PostCore
): Promise<Post> {
  if (post[from]) {
    const isArray = Array.isArray(post[from])
    try {
      let data: object | object[]
      if (isArray) {
        data = await context._loaders[loader].id.loadMany(
          post[from] as string[]
        )
        data = (data as object[]).filter((el) => el !== null)
      } else {
        data = await context._loaders[loader].id.load(post[from] as string)
        if (data == null) {
          data = {}
        }
      }
      // @ts-ignore
      post[to] = data
    } catch (error) {
      logger.error(error)
      // @ts-ignore
      post[to] = {}
    }
    return post
  } else {
    return post
  }
}

export default {
  before: (context: LoaderContext) => {
    context._loaders = {
      subject: { id: createBatchLoader(context, 'subjects') },
      room: { id: createBatchLoader(context, 'rooms') },
      user: { id: createBatchLoader(context, 'users') },
    }
  },
  joins: {
    subject: () => async (post: Post, context: LoaderContext) =>
      await joinId(context, 'subject', post, 'subjectId', 'subject'),
    room: () => async (post: Post, context: LoaderContext) =>
      await joinId(context, 'room', post, 'roomId', 'room'),
    creator: () => async (post: Post, context: LoaderContext) =>
      await joinId(context, 'user', post, 'creatorId', 'creator'),
    // students: () => async (post: Post, context: LoaderContext) =>
    //   await joinId(context, 'user', post, 'studentsIds', 'students'),
    tutors: () => async (post: Post, context: LoaderContext) =>
      await joinId(context, 'user', post, 'tutorsIds', 'tutors'),
  },
}
