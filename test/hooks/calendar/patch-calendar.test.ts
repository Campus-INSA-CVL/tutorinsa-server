import patchCalendar from '../../../src/hooks/calendar/patch-calendar'
import app from '../../../src/app'
import {
  Post,
  Room,
  Calendar,
  User,
  CalendarCore,
} from '../../../src/declarations'
import addDataToUser from '../../utils/addDataToUser'
import createDate from '../../utils/createDate'

import { HookContext, Service, Params, Paginated } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'

describe("'patch-calendar' hook", () => {
  let context: HookContext<
    Post & {
      room: Room
      calendar?: Calendar
    }
  >

  let result: HookContext<
    Post & {
      room: Room
      calendar?: Calendar
    }
  >

  let room: Room
  let post: Post
  let anotherPost: Post
  let user: User
  let error: Error | null

  let calendars: Paginated<Calendar>

  const params: Params = {}

  beforeAll(async () => {
    await app.get('mongooseClient').model('rooms').find().deleteMany()
    await app.get('mongooseClient').model('posts').find().deleteMany()
    await app.get('mongooseClient').model('calendars').find().deleteMany()
    await app.get('mongooseClient').model('users').find().deleteMany()

    const dataUser: User = {
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: '$Azerty1',
      permissions: ['eleve'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
      createdPostsIds: [],
    }

    try {
      await addDataToUser(dataUser)
      user = await app.service('users').create(dataUser)
    } catch (e) {
      // Error
    }
    params.user = user

    room = {
      campus: 'blois',
      name: 'E.106',
      day: 'lundi',
      startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
      duration: 120,
    }
    try {
      room = await app.service('rooms').create(room)
    } catch (error) {
      // An error?
    }

    post = {
      comment: 'hello there',
      type: 'eleve',
      startAt: createDate(),
      duration: 30,
      studentsCapacity: 15,
      tutorsCapacity: 2,
      subjectId: '5ccaea940db44157d84e8c93',
      roomId: room._id.toString(),
      studentsIds: [],
      tutorsIds: [],
      creatorId: '5ccaea940db44157d84e8c93',
    }

    try {
      post = await app.service('posts').create(post, params)
    } catch (error) {
      // An error?
    }

    try {
      calendars = (await app.service('calendars').find()) as Paginated<Calendar>
    } catch (e) {
      //
    }
  })

  beforeEach(() => {
    context = {
      app,
      service: {} as Service<any>,
      method: 'create',
      params: {},
      path: '',
      type: 'before',
    }

    result = null
    error = null
  })

  it('nothing should happend without data', async () => {
    expect.assertions(2)
    try {
      result = (await patchCalendar('create')(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should work with correct data', async () => {
    expect.assertions(6)

    anotherPost = {
      comment: 'hello there',
      type: 'eleve',
      startAt: createDate(30),
      duration: 30,
      studentsCapacity: 15,
      tutorsCapacity: 2,
      subjectId: '5ccaea940db44157d84e8c93',
      roomId: room._id.toString(),
      studentsIds: [],
      tutorsIds: [],
      creatorId: '5ccaea940db44157d84e8c93',
    }
    anotherPost._id = '5ccaea940db44157d84e8c93'

    const data = {
      ...anotherPost,
      room,
      calendar: calendars.data[0],
    }

    context.data = Object.assign({}, data) as Post & {
      calendar?: Calendar
      room: Room
    }

    // @ts-ignore
    context.result = Object.assign({}, anotherPost)

    try {
      result = (await patchCalendar('create')(context)) as HookContext
    } catch (e) {
      error = e
    }

    try {
      calendars = (await app.service('calendars').find()) as Paginated<Calendar>
    } catch (e) {
      //
    }

    expect(error).toBeNull()
    expect(calendars.data[0]).toBeDefined()
    expect(calendars.data[0].roomId.toString()).toBe(room._id.toString())
    expect(calendars.data[0].slots[0].postId.toString()).toBe(
      post._id.toString()
    )
    expect(calendars.data[0].slots[1].postId.toString()).toBe(
      anotherPost._id.toString()
    )
    expect(calendars.data[0].slots[1]).toHaveProperty('startAt')
    expect(result).toEqual(context)
  })
})
