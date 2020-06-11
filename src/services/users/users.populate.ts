import { HookContext } from '@feathersjs/feathers'
import BatchLoader from '@feathers-plus/batch-loader'
import { callingParams } from 'feathers-hooks-common'

import { User } from '../../declarations'
import logger from '../../logger'

const { getResultsByKey, getUniqueKeys } = BatchLoader
// split in functions and read the documentation to be sure that everything is correct
export default {
  before: (context: HookContext & { _loaders: object }) => {
    context._loaders = { year: {} }
    context._loaders.year.id = new BatchLoader(
      async (keys: string[], ctx: HookContext) => {
        const { app } = ctx
        const result = await app.service('years').find(
          callingParams({
            query: { _id: { $in: getUniqueKeys(keys) } },
            propNames: ['user', 'authentication', 'ability'],
            newProps: { provider: null },
          })(context)
        )
        return getResultsByKey(keys, result, (year) => year._id, '!')
      },
      { context }
    )
  },
  joins: {
    year: () => async (
      user: User,
      context: HookContext & { _loaders: object }
    ) => {
      if (user.yearId) {
        try {
          let year = await context._loaders.year.id.load(user.yearId)
          if (year == null) {
            year = {}
          }
          return (user.year = year)
        } catch (error) {
          logger.error(error)
          return (user.year = {})
        }
      }
    },
  },
}
