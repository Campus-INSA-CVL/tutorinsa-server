import addRoom from '../../../src/hooks/add/add-room'
import app from '../../../src/app'

import { HookContext, Service, Paginated } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'

import { Room } from '../../../src/declarations'

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
})
