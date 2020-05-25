import { Service, MongooseServiceOptions } from 'feathers-mongoose'
import { Application, User } from '../../declarations'
import { NullableId, Params } from '@feathersjs/feathers'

import { updateCreatedPostsIds } from './users.functions'

export class Users extends Service {
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options)
  }
  async patch(id: NullableId, data: Partial<User>, params?: Params) {
    if (params?.user) {
      const { user } = params
      data = updateCreatedPostsIds(data, user)
    }
    return super.patch(id, data, {})
  }
}
