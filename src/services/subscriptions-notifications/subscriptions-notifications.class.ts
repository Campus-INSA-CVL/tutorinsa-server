import { GeneralError } from '@feathersjs/errors'
import { Id, Params } from '@feathersjs/feathers'
import { Service, MongooseServiceOptions } from 'feathers-mongoose'
import { Application, User } from '../../declarations'

export class SubscriptionsNotifications extends Service {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options)
  }
  async create(data: PushSubscription & { userId: Id }, params: Params) {
    const { user } = params
    if (!(user as User)._id) {
      throw new GeneralError(
        'a user must be provided to subscribe to notification'
      )
    }
    data.userId = (user as User)._id?.toString()!
    return super.create(data, params)
  }
}
