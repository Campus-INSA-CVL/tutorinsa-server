import addRoom from '../../../src/hooks/add/add-room'
import app from '../../../src/app'

import { HookContext, Service, Paginated, Params } from '@feathersjs/feathers'
import { GeneralError, BadRequest } from '@feathersjs/errors'

import { Room, User, Post } from '../../../src/declarations'
import addDataToUser from '../../utils/addDataToUser'
import createDate from '../../utils/createDate'

describe("'add-room' hook", () => {
  let context: HookContext<Room>

  let result: HookContext<Room>
  let error: Error | null

  let room: Room = {
    campus: 'blois',
    name: 'E.106',
    day: 'lundi',
    startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
    duration: 120,
  }

  beforeAll(async () => {
    try {
      await app.service('rooms').create(room)
    } catch (error) {
      // Do nothing, it just means the room already exists and can be tested
    }
    try {
      const findRooms = (await app
        .service('rooms')
        .find({ query: { name: room.name } })) as Paginated<Room>
      room = findRooms.data[0]
    } catch (error) {
      // There is a real error
    }
  })

  beforeEach(async () => {
    context = {
      app,
      service: {} as Service<Room>,
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
      result = (await addRoom()(context)) as HookContext<Room>
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })

  it('nothing should happend without a room id', async () => {
    expect.assertions(2)

    context.data = Object.assign({}, room)

    try {
      result = (await addRoom()(context)) as HookContext<Room>
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })

  it('should work with correct data', async () => {
    expect.assertions(2)

    context.data = Object.assign({}, room)
    context.data.roomId = room._id

    try {
      result = (await addRoom()(context)) as HookContext<Room>
    } catch (e) {
      error = e
    }

    expect(result.data.room).toEqual(room)
    expect(error).toBeNull()
  })

  it('should throw an error if a problem appear', async () => {
    expect.assertions(2)

    context.data = Object.assign({}, room)
    context.data.roomId = 'data'

    try {
      result = (await addRoom()(context)) as HookContext<Room>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toBe('impossible to add a room to data')
  })

  describe("method 'remove'", () => {
    let post: Post
    let user: User

    const params: Params = {}

    beforeAll(async () => {
      await app.get('mongooseClient').model('posts').find().deleteMany()
      await app.get('mongooseClient').model('users').find().deleteMany()
      await app.get('mongooseClient').model('calendars').find().deleteMany()

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
      // @ts-ignore
      context.method = 'remove'
    })

    it('should throw an error if there is no id', async () => {
      try {
        await addRoom()(context)
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('an id is required to add a room')
    })

    it('should thow an error if the getPost failed', async () => {
      context.id = 'a fake id !'

      try {
        await addRoom()(context)
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(GeneralError)
      expect(error.message).toBe('impossible to get post')
    })

    it('should add startAt from the post and the room the data', async () => {
      context.id = post._id

      try {
        result = (await addRoom()(context)) as HookContext<Room>
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result.data).toHaveProperty('startAt')
      expect(result.data.room).toEqual(room)
    })
  })
})
