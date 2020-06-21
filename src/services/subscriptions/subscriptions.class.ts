import { Id, NullableId, Params, ServiceMethods } from '@feathersjs/feathers'
import { Application, Subscription, Post, User } from '../../declarations'
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

  /* istanbul ignore next */
  async find(params?: Params): Promise<any> {
    return
  }

  /* istanbul ignore next */
  async get(id: Id, params?: Params): Promise<any> {
    return {}
  }

  /* istanbul ignore next */
  async create(data: Subscription, params?: Params): Promise<any> {
    return
  }

  /* istanbul ignore next */
  async update(
    id: NullableId,
    data: Subscription,
    params?: Params
  ): Promise<any> {
    return
  }

  async patch(
    id: Id,
    data: Subscription,
    params: Params
  ): Promise<Subscription> {
    const { user } = params

    // Patch the post and the user for the subcription
    const options = { subType: data.type, post: params.post, user }

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

  /* istanbul ignore next */
  async remove(id: NullableId, params?: Params): Promise<any> {
    return
  }
}
