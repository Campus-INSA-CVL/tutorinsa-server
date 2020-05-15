import checkDate from '../../../src/hooks/check/check-date'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { Room } from '../../../src/declarations'
import { BadRequest } from '@feathersjs/errors'

describe("'check-date' hook", () => {
  let context: HookContext<Room>
  let error: Error | null = null
  let result: HookContext<Room>

  beforeEach(() => {
    context = {
      app: {} as Application,
      service: {} as Service<Room>,
      method: 'create',
      params: {},
      path: '',
      type: 'before',
    }
    result = null
    error = null
  })

  it('nothing should append with correct data', async () => {
    expect.assertions(2)
    const data = {
      startAt: 'Wed May 13 2020 19:30:00 GMT+0000',
      duration: 120,
    }

    context.data = data as Room

    try {
      result = (await checkDate()(context)) as HookContext<Room>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it.each([
    ['startAt', 'Wed May 13 2020 19:36:00 GMT+0000'],
    ['duration', 42],
  ])(
    'should throw an error because of incorrect field %s',
    async (key, value) => {
      expect.assertions(2)

      const data: object = {}
      data[key] = value

      context.data = data as Room

      try {
        await checkDate()(context)
      } catch (e) {
        error = e
      }

      if (key === 'startAt') {
        expect(error).toBeInstanceOf(BadRequest)
        expect(error.message).toBe('minutes must be 00 or 30')
      } else if (key === 'duration') {
        expect(error).toBeInstanceOf(BadRequest)
        expect(error.message).toBe('duration must be a multiple of 30')
      }
    }
  )
})
