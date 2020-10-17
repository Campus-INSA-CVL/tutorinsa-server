import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers'
import { Application } from '../../declarations'

// interface {} {}

// interface ServiceOptions {}

export class Push implements ServiceMethods<{}> {
  app: Application
  options: {}

  constructor(options: {}, app: Application) {
    this.options = options
    this.app = app
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<{}[] | Paginated<{}>> {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<{}> {
    return {}
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create({}: {}, params?: Params): Promise<{}> {
    return {}
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: NullableId, {}: {}, params?: Params): Promise<{}> {
    return {}
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, {}: {}, params?: Params): Promise<{}> {
    return {}
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<{}> {
    return { id }
  }
}
