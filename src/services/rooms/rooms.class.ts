import { Service, MongooseServiceOptions } from 'feathers-mongoose'
import { Application } from '../../declarations'

export class Rooms extends Service {
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options)
  }
}
