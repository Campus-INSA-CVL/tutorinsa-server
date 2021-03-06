import { Service, MongooseServiceOptions } from 'feathers-mongoose'
import { Application, User } from '../../declarations'
import { NullableId, Params } from '@feathersjs/feathers'

import { updateCreatedPostsIds, updateSubscriptions } from './users.functions'

export class Users extends Service {
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options)
  }
  async patch(id: NullableId, data: Partial<User>, params?: Params) {
    let patchedData: Partial<User> = data
    if (params?.user) {
      const { user } = params
      patchedData = Object.assign(
        patchedData,
        updateCreatedPostsIds(data, user)
      )
      patchedData = Object.assign(
        patchedData,
        updateSubscriptions(data, user, params)
      )
    }
    return super.patch(id, patchedData, {})
  }
}
