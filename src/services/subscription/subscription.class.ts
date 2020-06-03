import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers'
import { Application, PostType } from '../../declarations'

interface Data {
  type: 'subscribe' | 'unsubscribe'
  as: PostType
}
// tslint:disable-next-line
interface ServiceOptions {}

export class Subscription implements ServiceMethods<Data> {
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

  async create(data: Data, params?: Params): Promise<any> {
    return
  }

  async update(id: NullableId, data: Data, params?: Params): Promise<any> {
    return
  }

  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  async remove(id: NullableId, params?: Params): Promise<any> {
    return
  }
}
