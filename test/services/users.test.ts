import { MethodNotAllowed, FeathersErrorJSON } from '@feathersjs/errors'
import app from '../../src/app'
import { Paginated } from '@feathersjs/feathers'
import addDataToUser from '../utils/addDataToUser'
import {
  User,
  UserPermission,
  Department,
  Subject,
  Year,
} from '../../src/declarations'

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
      let error: FeathersErrorJSON | null = null
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

      const newDepartment: Department = await app
        .service('departments')
        .create({ name: 'STI' })

      const patchedResult: User = await app
        .service(serviceName)
        .patch(result._id, { departmentId: newDepartment._id.toString() })

      expect(typeof patchedResult.departmentId).toBe('object')
      expect(patchedResult.departmentId).toEqual(newDepartment._id)
    })

    it('should patch subjectsId', async () => {
      expect.assertions(2)

      const newSubjects: Subject = await app
        .service('subjects')
        .create({ name: 'CC' })

      let patchedResult: User

      patchedResult = (await app.service(serviceName).patch(result._id, {
        favoriteSubjectsIds: [newSubjects._id.toString()],
      })) as User

      expect(patchedResult.favoriteSubjectsIds).toEqual(
        expect.arrayContaining([newSubjects._id])
      )

      patchedResult = (await app.service(serviceName).patch(result._id, {
        difficultSubjectsIds: [newSubjects._id.toString()],
      })) as User

      expect(patchedResult.difficultSubjectsIds).toEqual(
        expect.arrayContaining([newSubjects._id])
      )
    })
  })
})
