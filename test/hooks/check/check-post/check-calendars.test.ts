import checkCalendars from '../../../../src/hooks/check/check-post/check-calendars'
import app from '../../../../src/app'
import { Room, Post, Calendar } from '../../../../src/declarations'
import { HookContext, Service, Application } from '@feathersjs/feathers'
import { BadRequest, GeneralError } from '@feathersjs/errors'

describe("'check-calendars' hook", () => {
  let context: HookContext<
    Post & { room: Room; calendar: Calendar | undefined }
  >
  let result: HookContext<Post & { room: Room; calendar: Calendar | undefined }>
  let error: Error | null

  beforeEach(async () => {
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
      result = (await checkCalendars()(context)) as HookContext<
        Post & { room: Room; calendar: Calendar | undefined }
      >
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })

  it('should throw an error if a room is not provided', async () => {
    expect.assertions(2)

    const data: unknown = {
      key: 'value',
    }

    context.data = Object.assign({}, data) as Post & {
      room: Room
      calendar: Calendar | undefined
    }

    try {
      result = (await checkCalendars()(context)) as HookContext<
        Post & { room: Room; calendar: Calendar | undefined }
      >
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toBe('no room provided to check calendars')
  })

  it('should return if no calendar is provided', async () => {
    expect.assertions(2)

    const data: unknown = {
      room: {
        _id: '5e28944c60e9be0d88bb897f',
        startAt: '1970-01-01T19:00:00.000Z',
      },
      startAt: '2020-05-21T19:00:00.000Z',
    }

    context.data = Object.assign({}, data) as Post & {
      room: Room
      calendar: Calendar | undefined
    }

    try {
      result = (await checkCalendars()(context)) as HookContext<
        Post & { room: Room; calendar: Calendar | undefined }
      >
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })

  describe("'create' method", () => {
    let calendar: Calendar

    beforeEach(async () => {
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

    beforeAll(async () => {
      const data = {
        post: {
          _id: '5e28944c60e9be0d88bb897e',
          startAt: '2020-05-21T19:00:00.000Z',
          duration: 30,
        },
        room: {
          _id: '5e28944c60e9be0d88bb897f',
          startAt: '1970-01-01T19:00:00.000Z',
        },
      }

      calendar = await app
        .service('calendars')
        .create(data as { post: Post; room: Room }, {})
    })

    afterAll(async () => {
      await app.service('calendars').remove(calendar._id)
    })

    it('should work with correct data', async () => {
      expect.assertions(2)

      context.data = Object.assign({}, {
        startAt: '2020-05-21T19:30:00.000Z',
        duration: 60,
        room: {
          startAt: '1970-01-01T19:00:00.000Z',
          _id: '5e28944c60e9be0d88bb897f',
        },
        calendar,
      } as unknown) as Post & {
        room: Room
        calendar: Calendar | undefined
      }

      try {
        result = (await checkCalendars()(context)) as HookContext<
          Post & { room: Room; calendar: Calendar | undefined }
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result.data.calendar).toBeDefined()
    })

    it('should throw an error when a slot is not available', async () => {
      expect.assertions(2)

      context.data = Object.assign({}, {
        startAt: '2020-05-21T19:00:00.000Z',
        duration: 60,
        room: {
          startAt: '1970-01-01T19:00:00.000Z',
          _id: '5e28944c60e9be0d88bb897f',
        },
        calendar,
      } as unknown) as Post & {
        room: Room
        calendar: Calendar | undefined
      }

      try {
        result = (await checkCalendars()(context)) as HookContext<
          Post & { room: Room; calendar: Calendar | undefined }
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(`the slot at 19:0 is not available`)
    })
  })
})
