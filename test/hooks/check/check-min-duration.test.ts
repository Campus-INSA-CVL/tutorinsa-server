import checkMinDuration from '../../../src/hooks/check/check-min-duration'
import { HookContext, Service } from '@feathersjs/feathers'
import { Application, Post } from '../../../src/declarations'
import { BadRequest } from '@feathersjs/errors'

describe("'check-min-duration' hook", () => {
  let context: HookContext<Partial<Post>>
  let result: HookContext<Partial<Post>>
  let error: Error | null

  beforeEach(() => {
    context = {
      app: {} as Application,
      service: {} as Service<any>,
      method: 'create',
      params: {},
      path: '',
      type: 'before',
    }
    result = null
    error = null
  })

  it('nothing should happend without duration', async () => {
    try {
      result = (await checkMinDuration()(context)) as HookContext<Partial<Post>>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should work with correct duration', async () => {
    context.data = { duration: 52 }

    try {
      result = (await checkMinDuration()(context)) as HookContext<Partial<Post>>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should work with a custom minimal duration', async () => {
    context.data = { duration: 15 }

    try {
      result = (await checkMinDuration(10)(context)) as HookContext<
        Partial<Post>
      >
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should throw an error with incorrect data', async () => {
    context.data = { duration: 15 }

    try {
      result = (await checkMinDuration()(context)) as HookContext<Partial<Post>>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe('duration must be greater than 30')
  })
})
