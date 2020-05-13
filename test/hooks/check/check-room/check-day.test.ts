import checkDay from '../../../../src/hooks/check/check-room/check-day'
import { Room } from '../../../../src/declarations'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'check-day' hook", () => {
  let context: HookContext<Room>
  let result: HookContext<Room>

  let error: Error | null = null

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

  it('nothing should append without data', async () => {
    expect.assertions(2)

    try {
      result = (await checkDay()(context)) as HookContext<Room>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('nothing should append with correct data', async () => {
    expect.assertions(2)

    const data = {
      day: 'mardi',
    }

    context.data = data as Room

    try {
      result = (await checkDay()(context)) as HookContext<Room>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should throw an error because of incorrect field', async () => {
    expect.assertions(2)

    const data = {
      day: 'laundi',
    }

    context.data = data as Room

    try {
      await checkDay()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(`${data.day} is not a valid weeek day`)
  })
})
