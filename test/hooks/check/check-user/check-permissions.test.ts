import checkPermissions from '../../../../src/hooks/check/check-user/check-permissions'
import { HookContext, Service, Application } from '@feathersjs/feathers'
import { User, CheckPermissionsOptions } from '../../../../src/declarations'

describe("'check-permissions' hook", () => {
  let context: HookContext<User>
  let result: HookContext<User> | null = null

  let error: Error | null = null
  let user: User
  let studentUser: User
  let adminUser: User

  const permissionsOptions: CheckPermissionsOptions = {
    permissions: ['admin', 'eleve', 'tuteur'],
    admin: 'admin',
    default: 'eleve',
  }

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
      createdPostsIds: [],
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
      createdPostsIds: [],
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
      createdPostsIds: [],
    }

    error = null
    result = null
  })

  it('should remove admin permission from a non-admin user', async () => {
    expect.assertions(1)

    context.data = Object.assign({}, adminUser)

    try {
      result = (await checkPermissions(permissionsOptions)(
        context
      )) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(result.data.permissions).toEqual(
      expect.not.arrayContaining(['admin'])
    )
  })

  it('should set a default permission', async () => {
    expect.assertions(1)

    context.data = Object.assign({}, user)

    try {
      result = (await checkPermissions(permissionsOptions)(
        context
      )) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(result.data.permissions).toEqual(expect.arrayContaining(['eleve']))
  })

  it('should keep is admin permissionif he is admin', async () => {
    expect.assertions(1)

    context.data = Object.assign({}, adminUser)
    context.params.user = Object.assign({}, adminUser)

    try {
      result = (await checkPermissions(permissionsOptions)(
        context
      )) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(result.data.permissions).toEqual(expect.arrayContaining(['admin']))
  })

  it('should remove the unknown permission', async () => {
    expect.assertions(3)

    context.data = Object.assign({}, { permissions: ['unknown'] }) as User
    context.params.user = Object.assign({}, adminUser)

    try {
      result = (await checkPermissions(permissionsOptions)(
        context
      )) as HookContext<User>
    } catch (e) {
      error = e
    }

    expect(result.data.permissions.length).toBe(1)
    expect(result.data.permissions).toEqual(expect.arrayContaining(['eleve']))
    expect(result.data.permissions).toEqual(
      expect.not.arrayContaining(['unknown'])
    )
  })
})
