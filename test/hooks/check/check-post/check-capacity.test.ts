import checkCapacity from '../../../../src/hooks/check/check-post/check-capacity'
import { Post } from '../../../../src/declarations'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'check-capacity' hook", () => {
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
      result = (await checkCapacity()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('nothing should append with correct data', async () => {
    expect.assertions(2)

    const data = {
      studentsCapacity: 15,
      tutorsCapacity: 3,
    }

    context.data = Object.assign({}, data) as Post
    try {
      result = (await checkCapacity()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it.each([
    ['studentsCapacity', 0, 5, 20],
    ['tutorsCapacity', 0, 1, 5],
  ])(
    'should thow an error because of incorrect field %s',
    async (key, value, inf, sup) => {
      expect.assertions(2)

      const data = {}
      data[key] = value

      context.data = Object.assign({}, data) as Post
      try {
        result = (await checkCapacity()(context)) as HookContext<Post>
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(`${key} must be between ${inf} and ${sup}`)
    }
  )
})
