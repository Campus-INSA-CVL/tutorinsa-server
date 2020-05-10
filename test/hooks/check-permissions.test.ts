import checkPermissions from '../../src/hooks/check-permissions'
import { HookContext, Service, Application } from '@feathersjs/feathers'
import { FeathersErrorJSON } from '@feathersjs/errors'
import { User } from '../../src/declarations'

describe("'check-permissions' hook", () => {
  let context: HookContext<User>

  let user: User
  let studentUser: User
  let adminUser: User

  beforeEach(() => {
    context = {
      app: {} as Application,
      service: {} as Service<User>,
      method: 'create',
      params: {},
      path: 'users',
      type: 'before',
    }
    // User
    user = {
      lastName: 'USER',
      firstName: 'user',
      email: 'user@insa-cvl.fr',
      password: 'azer',
      permissions: [],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
    }
    // Student
    studentUser = {
      lastName: 'STUDENT',
      firstName: 'user',
      email: 'student@insa-cvl.fr',
      password: 'azer',
      permissions: ['eleve'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
    }
    // Admin
    adminUser = {
      lastName: 'ADMIN',
      firstName: 'user',
      email: 'admin@insa-cvl.fr',
      password: 'azer',
      permissions: ['eleve', 'admin'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
    }
  })

  it('should remove admin permission from a non-admin user', async () => {
    expect.assertions(1)
    let result: HookContext<User>
    let error: FeathersErrorJSON | null = null

    context.data = Object.assign({}, adminUser)

    try {
      result = (await checkPermissions()(context)) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(result.data.permissions).toEqual(
      expect.not.arrayContaining(['admin'])
    )
  })

  it('should a default permission', async () => {
    expect.assertions(1)
    let result: HookContext<User>
    let error: FeathersErrorJSON | null = null

    context.data = Object.assign({}, user)

    try {
      result = (await checkPermissions()(context)) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(result.data.permissions).toEqual(expect.arrayContaining(['eleve']))
  })

  it('should keep is admin permissionif he is admin', async () => {
    expect.assertions(1)
    let result: HookContext<User>
    let error: FeathersErrorJSON | null = null

    context.data = Object.assign({}, adminUser)
    context.params.user = Object.assign({}, adminUser)

    try {
      result = (await checkPermissions()(context)) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(result.data.permissions).toEqual(expect.arrayContaining(['admin']))
  })
})
