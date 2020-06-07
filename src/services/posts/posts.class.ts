import { Service, MongooseServiceOptions } from 'feathers-mongoose'
import {
  Application,
  Post,
  Calendar,
  Room,
  Subscription,
} from '../../declarations'
import { Params, Id, NullableId } from '@feathersjs/feathers'
import { getUserId } from './posts.functions'
import { updateSubcriptions } from '../users/users.functions'

export class Posts extends Service {
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options)
  }
  async find(params: Params) {
    return super.find(params)
  }
  async get(id: Id, params: Params) {
    return super.get(id, params)
  }
  async create(
    data: Post & { calendar?: Calendar; room?: Room },
    params: Params
  ) {
    const userId = getUserId(params)
    // Add the creator to the correct fields
    data.creatorId = userId
    if (data.type === 'tuteur') {
      data.tutorsIds = [userId]
    }

    return super.create(data, params)
  }
  async patch(
    id: NullableId,
    data: Partial<Post>,
    params: Params & { subType?: Subscription['type']; post?: Post }
  ) {
    let patchedData: Partial<Post> = {}

    patchedData = Object.assign(
      patchedData,
      updateSubcriptions(data, params.post as Post, params)
    )

    return super.patch(id, patchedData, {})
  }
}
