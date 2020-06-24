import checkIds from '../../../src/hooks/check/check-ids'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { User } from '../../../src/declarations'
import { BadRequest } from '@feathersjs/errors'

describe("'check-array-content' hook", () => {
  let context: HookContext<any>

  let error: Error | null
  let result: HookContext<any>

  let user: User

  beforeEach(() => {
    user = {
      lastName: 'LASTNAME',
      firstName: 'username',
      email: '',
      password: '$Azerty1',
      permissions: ['eleve'],
      yearId: '5cdf048e53bc6b09a4b6fbbd',
      departmentId: '5cdf048e53bc6b09a4b6fbbd',
      favoriteSubjectsIds: ['5cdf048e53bc6b09a4b6fbbd'],
      difficultSubjectsIds: ['5cdf048e53bc6b09a4b6fbbd'],
      createdPostsIds: [],
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
      result = (await checkIds()(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it.each([
    ['yearId', 1],
    ['favoriteSubjectsIds', 's5dc165s145d41csc51'],
    ['difficultSubjectsIds', ['data']],
  ])('should throw an error with %s, uncorrect data', async (key, value) => {
    expect.assertions(2)

    // @ts-ignore
    user[key] = value
    context.data = user

    try {
      await checkIds()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(`${value} in ${key} is incorrect`)
  })

  it('nothing should append with correct data', async () => {
    expect.assertions(2)

    context.data = user

    try {
      result = (await checkIds()(context)) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
})
