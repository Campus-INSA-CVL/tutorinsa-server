import { HookContext, Service } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import checkUserIsVerified from '../../../src/hooks/check/check-user-is-verified'
import { Application, User } from '../../../src/declarations'

describe("'check-user-is-verified' hook", () => {
  let context: HookContext
  let result: HookContext
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

  it('nothing should happens if there is not user', async () => {
    try {
      result = (await checkUserIsVerified()(context)) as HookContext
    } catch (e) {
      error = e
    }
    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('nothing should happens is user is verified', async () => {
    const user: Partial<User> = {
      isVerified: true,
    }

    context.params = Object.assign({}, { user })
    try {
      result = (await checkUserIsVerified()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should throw an error if user is not verified', async () => {
    const user: Partial<User> = {
      isVerified: false,
    }

    context.params = Object.assign({}, { user })
    try {
      result = (await checkUserIsVerified()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(Forbidden)
    expect(error.message).toBe('You must verified your account')
  })
})
