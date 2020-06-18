import authenticate from '../../../src/hooks/authentication/authenticate'
import app from '../../../src/app'
import { User } from '../../../src/declarations'
import addDataToUser from '../../utils/addDataToUser'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { AuthenticationResult } from '@feathersjs/authentication/lib'
import { GeneralError } from '@feathersjs/errors'

describe("'authenticate' hook", () => {
  let result: HookContext
  let context: HookContext
  let error: Error | null

  const dataUser: User = {
    lastName: 'fakeLastName',
    firstName: 'username',
    email: 'username@insa-cvl.fr',
    password: '$Azerty1',
    permissions: ['tuteur'],
    yearId: '',
    departmentId: '',
    favoriteSubjectsIds: [],
    difficultSubjectsIds: [],
    createdPostsIds: [],
  }

  let user: User
  let authentication: AuthenticationResult

  beforeAll(async () => {
    await app.get('mongooseClient').model('users').find().deleteMany()

    try {
      await addDataToUser(dataUser)
      user = await app.service('users').create(dataUser)
    } catch (e) {
      // Error
    }

    try {
      authentication = await app.service('authentication').create(
        {
          strategy: 'local',
          email: 'username@insa-cvl.fr',
          password: '$Azerty1',
        },
        {}
      )
    } catch (e) {
      //
    }
  })

  beforeEach(() => {
    context = {
      app,
      service: {} as Service<any>,
      method: 'create',
      params: {},
      path: 'users',
      type: 'before',
      result: {},
    }

    error = null
  })

  it('should authenticate a user', async () => {
    context.data = { accessToken: authentication.accessToken }
    context.params = {
      headers: { authorization: 'Bearer ' + authentication.accessToken },
      authentication: {
        strategy: 'jwt',
        accessToken: authentication.accessToken,
      },
    }

    try {
      result = (await authenticate()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result.params).toHaveProperty('authenticated', true)
  })

  it('should catch a notAuthenticated error', async () => {
    try {
      result = (await authenticate()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result.params).not.toHaveProperty('authenticated')
  })

  it('should throw an error', async () => {
    context.data = { accessToken: authentication.accessToken }
    context.params = {
      headers: { authorization: 'Bearer ' + authentication.accessToken + 'R' },
      authentication: {
        strategy: 'jwt',
        accessToken: authentication.accessToken + 'R',
      },
    }

    try {
      result = (await authenticate()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toBe('invalid signature')
  })
})
