import checkTime from '../../../../src/hooks/check/check-post/check-time'
import moment from '../../../../src/utils/moment'
import { Post } from '../../../../src/declarations'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'check-time' hook", () => {
  let context: HookContext<Post>

  let error: Error | null
  let result: HookContext<Post>

  beforeEach(() => {
    context = {
      app: {} as Application,
      service: {} as Service<Post>,
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
      result = (await checkTime()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('nothing should append with correct data', async () => {
    expect.assertions(2)

    const data = {
      startAt: moment().add(1, 'day').toISOString(),
    }

    context.data = Object.assign({}, data) as Post
    try {
      result = (await checkTime()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }
    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should thow an error because of incorrect field', async () => {
    expect.assertions(2)

    const data = {
      startAt: moment().subtract(1, 'day').toISOString(),
    }

    context.data = Object.assign({}, data) as Post
    try {
      result = (await checkTime()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe("can't register with a date in the past")
  })
})
