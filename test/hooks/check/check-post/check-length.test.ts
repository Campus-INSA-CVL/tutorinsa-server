import checkLength from '../../../../src/hooks/check/check-post/check-length'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { Post } from '../../../../src/declarations'
import { BadRequest } from '@feathersjs/errors'

describe("'check-length' hook", () => {
  let context: HookContext<Post>

  let error: Error | null
  let result: HookContext<Post>

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
  it('nothing should append without data', async () => {
    expect.assertions(2)

    try {
      result = (await checkLength()(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('nothing should append with correct data', async () => {
    expect.assertions(2)

    const data = { comment: 'a random string under 440 characters' }

    context.data = Object.assign({}, data) as Post
    try {
      result = (await checkLength()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('should thow an error because of incorrect field', async () => {
    expect.assertions(2)

    const max = 440
    const data = {
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque et metus lectus. Suspendisse ex nulla, elementum in magna sit amet, sollicitudin aliquam nulla. In placerat facilisis mi, nec lobortis dolor blandit sit amet. Nulla mollis metus urna, quis posuere est mollis in. Nulla maximus nisl ac libero auctor posuere. In ac dolor velit. In commodo enim non tellus aliquet, nec vestibulum ligula eleifend. In non nibh nunc efficitur.',
    }

    context.data = Object.assign({}, data) as Post
    try {
      result = (await checkLength()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(`comment can't exceed ${max} characters`)
  })
})
