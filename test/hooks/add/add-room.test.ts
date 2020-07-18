import addRoom from '../../../src/hooks/add/add-room'
import app from '../../../src/app'

import { HookContext, Service, Paginated, Params } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'

import { Room, Post } from '../../../src/declarations'

describe("'add-room' hook", () => {
  let context: HookContext<Post>

  let result: HookContext<Post>
  let error: Error | null

  let room: Room = {
    campus: 'blois',
    name: 'E.106',
    day: 'lundi',
    startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
    duration: 120,
  }

  const post: Partial<Post> = { roomId: '' }

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

    post.roomId = room._id
  })

  beforeEach(async () => {
    context = {
      app,
      service: {} as Service<Post>,
      method: 'create',
      params: {},
      path: '',
      type: 'before',
    }

    result = null
    error = null
  })

  it('nothing should happens without data', async () => {
    expect.assertions(2)
    try {
      result = (await addRoom()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })

  it('nothing should happens without a room id', async () => {
    expect.assertions(2)

    try {
      result = (await addRoom()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })

  it('should work with correct data', async () => {
    expect.assertions(2)

    context.data = { roomId: room._id } as Post

    try {
      result = (await addRoom()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(result.params.room).toEqual(room)
    expect(error).toBeNull()
  })

  it('should work with correct params', async () => {
    expect.assertions(2)

    context.params = Object.assign({}, { post })
    context.data = {} as Post

    try {
      result = (await addRoom()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result.params.room).toEqual(room)
  })

  it('should throw an error if a problem appear', async () => {
    expect.assertions(2)

    // @ts-ignore
    context.params = Object.assign(context.params, room)
    context.data = { roomId: 'data' } as Post

    try {
      result = (await addRoom()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toBe('impossible to add a room to data')
  })
})
