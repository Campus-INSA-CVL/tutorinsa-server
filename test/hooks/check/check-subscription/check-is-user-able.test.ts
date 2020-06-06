import checkIsUserAble from '../../../../src/hooks/check/check-subscription/check-is-user-able'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'ckeck-is-user-able' hook", () => {
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

  it('should required a authenticated user', async () => {
    context.data = {}

    try {
      await checkIsUserAble()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe('you must be authenticated')
  })

  it('should throw an error if the user do not have the correct permission', async () => {
    context.params = Object.assign({}, { user: { permissions: ['eleve'] } })
    context.data = Object.assign({}, { as: 'tuteur' })

    try {
      await checkIsUserAble()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe("you must be a 'tuteur' to do this")
  })

  it('nothing should append without data', async () => {
    context.params = Object.assign({}, { user: { permissions: ['eleve'] } })

    try {
      result = (await checkIsUserAble()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
})
