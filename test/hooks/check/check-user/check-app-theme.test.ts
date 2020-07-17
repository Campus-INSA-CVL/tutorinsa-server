import checkAppTheme from '../../../../src/hooks/check/check-user/check-app-theme'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { User } from '../../../../src/declarations'
import { BadRequest } from '@feathersjs/errors'

describe("'check-app-theme' hook", () => {
  let context: HookContext<User>

  let error: Error | null = null
  let result: HookContext<User>

  let user: User

  beforeEach(() => {
    user = {
      lastName: 'LASTNAME',
      firstName: 'username',
      email: '',
      password: '$Azerty1',
      permissions: ['eleve'],
      yearId: 'data',
      departmentId: 'data',
      favoriteSubjectsIds: ['data'],
      difficultSubjectsIds: ['data'],
      appTheme: '',
    }
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

  it('nothing should happend without appTheme property', async () => {
    try {
      result = (await checkAppTheme()(context)) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('nothing should happend with correct property', async () => {
    context.data = Object.assign({}, user)

    try {
      result = (await checkAppTheme()(context)) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('should throw an error if value is not a string', async () => {
    context.data = Object.assign({}, user, { appTheme: true })

    try {
      result = (await checkAppTheme()(context)) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(`'appTheme' must be a string`)
  })
})
