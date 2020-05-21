import { Service, MongooseServiceOptions } from 'feathers-mongoose'
import { Application, Calendar, Room, Post } from '../../declarations'
import {
  createSlots,
  createUTCTime,
  createConcatDate,
} from './calendars.functions'
import { Params, Id } from '@feathersjs/feathers'

export class Calendars extends Service {
  app: Application
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options)
    this.app = app
  }
  async create(data: { post: Post; room: Room }, params: Params) {
    const slots = createSlots(
      data.post.startAt,
      data.post.duration,
      data.post._id as string
    )

    const startAtCalendar = createConcatDate(
      data.post.startAt,
      data.room.startAt
    )

    const calendarData: Calendar = {
      startAt: startAtCalendar,
      roomId: data.room._id as string,
      slots,
    }
    return super.create(calendarData, params)
  }
}
