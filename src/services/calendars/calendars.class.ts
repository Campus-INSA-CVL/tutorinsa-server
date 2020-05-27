import { Service, MongooseServiceOptions } from 'feathers-mongoose'
import { Application, Calendar, Room, Post, Slot } from '../../declarations'
import {
  createSlots,
  createConcatDate,
  patchSlots,
  removeSlots,
} from './calendars.functions'
import { Params, Id, HookContext } from '@feathersjs/feathers'

export class Calendars extends Service {
  app: Application
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options)
    this.app = app
  }
  async create(data: { post: Post; room?: Room }, params?: Params) {
    const slots = createSlots(
      data.post.startAt,
      data.post.duration,
      data.post._id as string
    )

    const startAtCalendar = createConcatDate(
      data.post.startAt,
      data.room!.startAt
    )

    const calendarData: Calendar = {
      startAt: startAtCalendar,
      roomId: data.room!._id as string,
      slots,
    }
    return super.create(calendarData, params)
  }
  async patch(
    id: Id,
    data: { post: Post; calendar: Calendar },
    params: Params & { from: HookContext['method'] }
  ) {
    let slots: Slot[] = []
    switch (params.from) {
      case 'create':
        slots = patchSlots(data.calendar, data.post)
        break
      case 'patch':
        if (data.calendar.slots) {
          slots = patchSlots(data.calendar, data.post)
        }
        break
      case 'remove':
        slots = removeSlots(data.calendar, data.post)
        break
      default:
        throw new Error(`'${params.from}' is not valid, unknow source`)
    }

    return super.patch(id, slots, params)
  }
}
