import { MethodNotAllowed } from '@feathersjs/errors'
import app from '../../../src/app'
import { Paginated, Params } from '@feathersjs/feathers'
import addDataToUser from '../../utils/addDataToUser'
import {
  User,
  UserPermission,
  Department,
  Subject,
  Year,
} from '../../../src/declarations'

const serviceName = 'users'

const permissions: UserPermission[] = ['eleve', 'tuteur', 'admin']

describe(`'${serviceName}' service`, () => {
  it('registered the service', () => {
    const service = app.service(serviceName)
    expect(service).toBeTruthy()
  })

  describe('documentation', () => {
    it('should have a documentation', () => {
      const service = app.service(serviceName)

      expect(service.docs).toBeDefined()
      expect(service.docs).toHaveProperty('description')
    })
  })

  describe('internal CRUD', () => {
    let result: User | null = null
    let error: Error | null = null

    const params: Params = {}

    // User with admin permission
    const user: User = {
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: '$Azerty1',
      permissions,
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
      createdPostsIds: [],
    }

    // User without permissions
    const anotherUser: User = {
      lastName: 'anotherLastName',
      firstName: 'another',
      email: 'another@insa-cvl.fr',
      password: '$Azerty1',
      // should be empty
      permissions: [],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
      createdPostsIds: [],
    }

    beforeAll(async () => {
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
      await app.get('mongooseClient').model('years').find().deleteMany()
      await app.get('mongooseClient').model('departments').find().deleteMany()
      await app.get('mongooseClient').model('subjects').find().deleteMany()

      await addDataToUser(user)
      await addDataToUser(anotherUser)
    })

    beforeEach(async (done) => {
      const results = (await app
        .service(serviceName)
        .find({ query: { email: user.email } })) as Paginated<User>

      result = results.data[0]
      if (!result) {
        try {
          result = (await app.service(serviceName).create(user)) as User
        } catch (error) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }
      done()
    })

    afterEach(() => {
      result = null
      error = null
    })
    it('should find', async () => {
      expect.assertions(4)
      // Find all documents in the DB using mongoose
      const dbResults: any = await app
        .get('mongooseClient')
        .model(serviceName)
        .find()
      const dbLength: number = dbResults.length

      let results: Paginated<User>
      try {
        // Find data using the Feathersjs service
        results = (await app.service(serviceName).find()) as Paginated<User>
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(results).toBeDefined()
      expect(results).toHaveProperty('total', dbLength)
      expect(Array.isArray(results.data)).toBeTruthy()
    })

    it('should create a user removing admin permission', () => {
      expect(result).toBeDefined()

      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('lastName', user.lastName.toLowerCase())
      expect(result).toHaveProperty('firstName', user.firstName.toLowerCase())
      expect(result).toHaveProperty('email', user.email.toLowerCase())
      expect(result.password).not.toBe(user.password)

      expect(result.permissions).toEqual(expect.not.arrayContaining(['admin']))

      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })

    it('should create a user with the default permission (eleve)', async () => {
      expect.assertions(9)

      const anotherResult: User = await app
        .service(serviceName)
        .create(anotherUser)

      expect(anotherResult).toBeDefined()

      expect(anotherResult).toHaveProperty('_id')
      expect(anotherResult).toHaveProperty(
        'lastName',
        anotherUser.lastName.toLowerCase()
      )
      expect(anotherResult).toHaveProperty(
        'firstName',
        anotherUser.firstName.toLowerCase()
      )
      expect(anotherResult).toHaveProperty(
        'email',
        anotherUser.email.toLowerCase()
      )
      expect(anotherResult.password).not.toBe(anotherUser.password)

      expect(anotherResult.permissions).toEqual(
        expect.arrayContaining(['eleve'])
      )

      expect(anotherResult).toHaveProperty('createdAt')
      expect(anotherResult).toHaveProperty('updatedAt')
    })

    it('should not update (disallow)', async () => {
      expect.assertions(1)
      try {
        await app.service(serviceName).update(result._id, anotherUser)
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should patch the permission', async () => {
      const newPermission: UserPermission[] = ['eleve']

      const patchedResult: User = await app
        .service(serviceName)
        .patch(result._id, { permissions: newPermission })

      expect(patchedResult.permissions).toStrictEqual(newPermission)
    })

    it('should patch the yearId', async () => {
      expect.assertions(2)

      const newYear: Year = await app.service('years').create({ name: '4A' })

      const patchedResult: User = await app
        .service(serviceName)
        .patch(result._id, { yearId: newYear._id.toString() })

      expect(typeof patchedResult.yearId).toBe('object')
      expect(patchedResult.yearId).toEqual(newYear._id)
    })

    it('should patch the departmentId', async () => {
      expect.assertions(2)

      let newDepartment: Department
      try {
        newDepartment = await app.service('departments').create({ name: 'STI' })
      } catch (e) {
        error = e
      }

      const patchedResult: User = await app
        .service(serviceName)
        .patch(result._id, { departmentId: newDepartment._id.toString() })

      expect(typeof patchedResult.departmentId).toBe('object')
      expect(patchedResult.departmentId).toEqual(newDepartment._id)
    })

    it('should patch subjectsId', async () => {
      expect.assertions(2)

      let newSubject: Subject
      try {
        newSubject = await app.service('subjects').create({ name: 'CC' })
      } catch (e) {
        error = e
      }

      let patchedResult: User

      patchedResult = (await app.service(serviceName).patch(result._id, {
        favoriteSubjectsIds: [newSubject._id.toString()],
      })) as User

      expect(patchedResult.favoriteSubjectsIds).toEqual(
        expect.arrayContaining([newSubject._id])
      )

      patchedResult = (await app.service(serviceName).patch(result._id, {
        difficultSubjectsIds: [newSubject._id.toString()],
      })) as User

      expect(patchedResult.difficultSubjectsIds).toEqual(
        expect.arrayContaining([newSubject._id])
      )
    })

    it.each(['add', 'remove'])(
      "should patch 'createdPostsIds' (%s))",
      async (arg) => {
        params.user = result

        let patchedResult: User
        try {
          patchedResult = await app.service(serviceName).patch(
            result._id,
            // @ts-ignore
            { createdPostsIds: ['5ccaea940db44157d84e8c93'] },
            params
          )
        } catch (e) {
          error = e
        }

        if (arg === 'add') {
          expect(patchedResult.createdPostsIds.length).toBe(1)
          expect(patchedResult.createdPostsIds[0].toString()).toBe(
            '5ccaea940db44157d84e8c93'
          )
        } else if (arg === 'remove') {
          expect(patchedResult.createdPostsIds.length).toBe(0)
        }
      }
    )

    it('should remove', async () => {
      expect.assertions(9)

      const deletedResult: User = await app
        .service(serviceName)
        .remove(result._id)

      expect(deletedResult).toBeDefined()

      expect(deletedResult).toHaveProperty('_id', result._id)
      expect(deletedResult).toHaveProperty('lastName')
      expect(deletedResult).toHaveProperty('firstName')
      expect(deletedResult).toHaveProperty('email')
      expect(deletedResult.password).not.toBe(user.password)

      expect(deletedResult).toHaveProperty('permissions')

      expect(deletedResult).toHaveProperty('createdAt')
      expect(deletedResult).toHaveProperty('updatedAt')
    })
  })

  describe('external CRUD', () => {
    let result: User | null = null
    let error: Error | null = null

    let user: User
    let params: Params

    const dataUser: User = {
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: '$Azerty1',
      permissions: ['eleve'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
      createdPostsIds: [],
    }

    beforeAll(async () => {
      // Delete all the data from the rooms collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()

      try {
        await addDataToUser(dataUser)
        user = await app.service('users').create(dataUser)
      } catch (e) {
        // Error
      }
    })

    beforeEach(() => {
      params = { provider: 'external' }
    })

    afterEach(() => {
      result = null
      error = null
    })
    it("should not patch 'createdPostsIds'", async () => {
      params.user = user

      try {
        result = await app.service(serviceName).patch(
          user._id,
          // @ts-ignore
          { createdPostsIds: ['5ccaea940db44157d84e8c93'] },
          params
        )
      } catch (e) {
        error = e
      }

      expect(result.createdPostsIds.length).toBe(0)
    })
  })
})
