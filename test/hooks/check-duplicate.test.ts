import checkDuplicate from '../../src/hooks/check-duplicate'
import { HookContext, Application, Service } from '@feathersjs/feathers'

describe("'check-duplicate' hook", () => {
  const serviceName = 'departments'
  let context: HookContext<User>

  let result: HookContext<User>
  let error: Error | null

  const user: User = {
    lastName: 'LASTNAME',
    firstName: 'username',
    email: 'username@insa-cvl.fr',
    password: '$Azerty1',
    permissions: ['eleve'],
    yearId: 'data',
    departmentId: 'data',
    favoriteSubjectsIds: ['data'],
    difficultSubjectsIds: ['data'],
  }

  beforeEach(() => {
    context = {
      app: {} as Application,
      service: {} as Service<User>,
      method: 'create',
      params: {},
      path: serviceName,
      type: 'before',
    }

    result = null
    error = null
  })

  it('should remove duplicate items', async () => {
    const tmp: User = Object.assign({}, user)

    Object.keys(user).forEach((key: string) => {
      if (Array.isArray(user[key])) {
        tmp[key].push(tmp[key][0])
      }
    })

    context.data = Object.assign({}, tmp)

    try {
      result = (await checkDuplicate()(context)) as HookContext<User>
    } catch (e) {
      error = e
    }

    Object.keys(user).forEach((key: string) => {
      if (Array.isArray(result.data[key])) {
        expect(result.data[key]).not.toContainEqual(tmp[key])
      }
    })
  })
})
