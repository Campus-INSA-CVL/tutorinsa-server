import checEmail from '../../../../src/hooks/check/check-user/check-email'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import { User } from '../../../../src/declarations'

describe("'check-email' hook", () => {
  let context: HookContext<any>

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

  it('nothing should append without data', async () => {
    expect.assertions(2)

    try {
      result = (await checEmail()(context)) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('nohing should append with a good email', async () => {
    expect.assertions(1)

    user.email = 'user.name@insa-cvl.Fr'
    context.data = Object.assign({}, user)

    try {
      await checEmail()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
  })

  it("should throw an error because it's not an email", async () => {
    expect.assertions(2)

    user.email = 'thisIsNotAnEmail'
    context.data = Object.assign({}, user)

    try {
      await checEmail()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe('must be a valid email')
  })

  it("should throw an error because it's not an INSA email", async () => {
    expect.assertions(2)

    user.email = 'this.not@email.com'
    context.data = Object.assign({}, user)

    try {
      await checEmail()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe('must be an INSA email')
  })
})
