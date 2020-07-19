import pickData from '../../../src/hooks/authentication/pick-data'
import ability from '../../utils/ability'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { permittedFieldsOf } from '@casl/ability/extra'

describe("'pickData' hook", () => {
  let result: HookContext
  let context: HookContext
  let error: Error | null

  beforeEach(() => {
    context = {
      app: {} as Application,
      service: {} as Service<any>,
      method: 'create',
      params: {},
      path: 'users',
      type: 'before',
      result: {},
    }

    error = null
  })
  it('nothing should happens without ability', async () => {
    context.params = {}

    try {
      result = (await pickData()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('nothing should happens without data', async () => {
    context.params = { ability }

    try {
      result = (await pickData()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('should remove unaccessible fields', async () => {
    context.params = { ability }
    context.data = {
      _id: '5ccaea940db44157d84e8c94',
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

    try {
      result = (await pickData()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result.data).toEqual({
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: '$Azerty1',
      permissions: ['tuteur'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
    })
  })
})
