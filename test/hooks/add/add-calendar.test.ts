import addCalendar from '../../../src/hooks/add/add-calendar'
import app from '../../../src/app'
import { Post, Room, Calendar, User } from '../../../src/declarations'
import addDataToUser from '../../utils/addDataToUser'
import createDate from '../../utils/createDate'
import { HookContext, Service, Params } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'

describe("'add-calendar' hook", () => {
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
  let user: User
  let error: Error | null

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
      permissions: ['tuteur'],
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
      type: 'tuteur',
      startAt: createDate(),
      duration: 60,
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
  it('nothing should happend without data.startAt', async () => {
    expect.assertions(2)
    try {
      result = (await addCalendar()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should throw an error if no room is provided', async () => {
    expect.assertions(2)

    context.data = Object.assign({}, { startAt: 'a custom date' }) as Post & {
      room: Room
    }

    try {
      result = (await addCalendar()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toEqual('no room provided to add a calendar')
  })

  it('should thow a error if find failed', async () => {
    expect.assertions(2)

    // @ts-ignore
    context.app = {}

    context.data = Object.assign({}, { ...post, room }) as Post & {
      room: Room
    }

    try {
      result = (await addCalendar()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toEqual('find calendars encountered an error')
  })

  it('should add the calendar to the context', async () => {
    expect.assertions(2)

    context.data = Object.assign({}, { ...post, room }) as Post & {
      room: Room
    }

    try {
      result = (await addCalendar()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result.data.calendar.roomId).toEqual(room._id)
  })

  it('should add an undefined calendar if no calendar is found', async () => {
    expect.assertions(2)

    const anotherRoom = room
    anotherRoom._id = '5ec1913f47bff53528e4b6fc'
    context.data = Object.assign({}, { ...post, room: anotherRoom }) as Post & {
      room: Room
    }

    try {
      result = (await addCalendar()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result.data.calendar).toBeUndefined()
  })
})
