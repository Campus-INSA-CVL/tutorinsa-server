import { Id, NullableId, Params, ServiceMethods } from '@feathersjs/feathers'
import { Application, Subscription } from '../../declarations'

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
    params?: Params
  ): Promise<Subscription> {
    // check the user permission to sub as a tutor, user must be a tutor create a hook before add room
    // add the post to the user and the user to the post, to do in the class
    // do all tests

    return data
  }

  async remove(id: NullableId, params?: Params): Promise<any> {
    return
  }
}
