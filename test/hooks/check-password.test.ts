import checkPassword from '../../src/hooks/check-password'
import { HookContext, Service, Application } from '@feathersjs/feathers'
import { BadRequest, FeathersErrorJSON } from '@feathersjs/errors'

describe("'check-password' hook", () => {
  // User without strong password
  let passwordUser: User

  let context: HookContext<User>

  beforeEach(() => {
    passwordUser = {
      lastName: 'PASSWORD',
      firstName: 'user',
      email: 'password@insa-cvl.fr',
      password: 'azer',
      permissions: ['eleve'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
    }

    context = {
      app: {} as Application,
      service: {} as Service<User>,
      method: 'create',
      params: {},
      path: 'users',
      type: 'before',
    }

    context.data = passwordUser
  })

  it('should not create user beacause of a weak password', async () => {
    expect.assertions(2)
    let error: FeathersErrorJSON | null = null

    try {
      await checkPassword()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe('this password is not strong enought')
  })
})
