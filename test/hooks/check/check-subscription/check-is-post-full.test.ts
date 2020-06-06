import checkIsPostFull from '../../../../src/hooks/check/check-subscription/check-is-post-full'
import { HookContext, Service } from '@feathersjs/feathers'
import { Application } from '../../../../src/declarations'
import { GeneralError, BadRequest } from '@feathersjs/errors'

describe("'check-is-post-full' hook", () => {
  let context: HookContext<any>

  let result: HookContext<any>
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

  it('should throw an error if there is no post in params', async () => {
    try {
      await checkIsPostFull()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toBe('a post is required to check if it is full')
  })

  it('should throw an error if the post is full of students', async () => {
    context.params = Object.assign({}, { post: { fullStudents: true } })
    context.data = Object.assign({}, { as: 'eleve', type: 'subscribe' })

    try {
      await checkIsPostFull()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(
      "can't subscribe as student because this post is full"
    )
  })

  it('should throw an error if the post is full of tutors', async () => {
    context.params = Object.assign({}, { post: { fullTutors: true } })
    context.data = Object.assign({}, { as: 'tuteur', type: 'subscribe' })

    let t
    try {
      t = await checkIsPostFull()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(
      "can't subscribe as tutor because this post is full"
    )
  })

  it('nothing should happend is there is no data', async () => {
    context.params = Object.assign({}, { post: { fullStudents: true } })

    try {
      result = (await checkIsPostFull()(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('nothing should happend if this is not a subscription', async () => {
    context.params = Object.assign({}, { post: { fullStudents: true } })
    context.data = Object.assign({}, { as: 'eleve', type: 'unsubscribe' })

    try {
      result = (await checkIsPostFull()(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('nothing should happend if there is still places', async () => {
    context.params = Object.assign({}, { post: { fullStudents: false } })
    context.data = Object.assign({}, { as: 'eleve', type: 'unsubscribe' })

    try {
      result = (await checkIsPostFull()(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
})
