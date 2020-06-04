import { Id, NullableId, Params, ServiceMethods } from '@feathersjs/feathers'
import { Application, Subscription, Post, User } from '../../declarations'
import { BadRequest, GeneralError } from '@feathersjs/errors'
import {
  createUserData,
  createPostData,
  patchSubcription,
} from './subscriptions.functions'

// tslint:disable-next-line
interface ServiceOptions {}

export class Subscriptions implements ServiceMethods<Subscription> {
  app: Application
  options: ServiceOptions

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options
    this.app = app
  }

  async find(params?: Params): Promise<any> {
    return
  }

  async get(id: Id, params?: Params): Promise<any> {
    return
  }

  async create(data: Subscription, params?: Params): Promise<any> {
    return
  }

  async update(
    id: NullableId,
    data: Subscription,
    params?: Params
  ): Promise<any> {
    return
  }

  async patch(
    id: NullableId,
    data: Subscription,
    params: Params
  ): Promise<Subscription> {
    if (!id) {
      throw new BadRequest('you must provide an id')
    }

    const { user } = params

    // Patch the post and the user for the subcription
    const options = { subType: data.type, post: params.post }

    const userData = createUserData(data.as, id)
    await patchSubcription(
      this.app,
      'users',
      (user as User)._id!,
      userData,
      options
    )

    const postData = createPostData(data.as, user._id)
    await patchSubcription(this.app, 'posts', id, postData, options)

    // maybe use makeParams
    // do all tests

    return data
  }

  async remove(id: NullableId, params?: Params): Promise<any> {
    return
  }
}
