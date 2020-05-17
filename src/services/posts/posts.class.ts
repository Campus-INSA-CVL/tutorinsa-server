import { Service, MongooseServiceOptions } from 'feathers-mongoose'
import { Application, Post } from '../../declarations'
import { Params, Id } from '@feathersjs/feathers'
import { getUserId } from './posts.functions'

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
  async create(data: Post, params: Params) {
    const userId = getUserId(params)
    // Add the creator to the correct fields
    data.creatorId = userId
    data.tutorsIds = [userId]

    return super.create(data, params)
  }
}
