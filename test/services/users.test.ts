import {
  MethodNotAllowed,
  BadRequest,
  FeathersErrorJSON,
} from '@feathersjs/errors'
import app from '../../src/app'
import mongoose from 'mongoose'
import { Paginated, Id } from '@feathersjs/feathers'

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

    // User without strong password
    const weakUser: User = {
      lastName: 'weakLastName',
      firstName: 'weak',
      email: 'weak@insa-cvl.fr',
      password: 'azer',
      // should be empty
      permissions: ['eleve'],
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
    })

    beforeEach(async () => {
      let results: any[] | Paginated<User>
      // Create data to put in users
      results = (await app
        .service('years')
        .find({ query: { name: '3a' } })) as Year[]

      let year: Year = results[0]
      if (!year) {
        try {
          year = (await app.service('years').create({ name: '3A' })) as Year
        } catch (error) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }

      results = (await app
        .service('departments')
        .find({ query: { name: 'stpi' } })) as Department[]

      let department: Department = results[0]
      if (!department) {
        try {
          department = (await app
            .service('departments')
            .create({ name: 'STPI' })) as Department
        } catch (error) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }

      results = (await app
        .service('subjects')
        .find({ query: { name: 'eps' } })) as Subject[]

      let subject: Subject = results[0]
      if (!subject) {
        try {
          subject = (await app
            .service('subjects')
            .create({ name: 'EPS' })) as Subject
        } catch (error) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }

      user.yearId = year._id.toString()
      user.departmentId = department._id.toString()
      user.favoriteSubjectsIds.push(subject._id.toString())
      user.difficultSubjectsIds.push(subject._id.toString())

      anotherUser.yearId = year._id.toString()
      anotherUser.departmentId = department._id.toString()
      anotherUser.favoriteSubjectsIds.push(subject._id.toString())
      anotherUser.difficultSubjectsIds.push(subject._id.toString())

      weakUser.yearId = year._id.toString()
      weakUser.departmentId = department._id.toString()
      weakUser.favoriteSubjectsIds.push(subject._id.toString())
      weakUser.difficultSubjectsIds.push(subject._id.toString())

      results = (await app
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
    })

    afterEach(async () => {
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

    it('should not create user beacause of a weak password', async () => {
      expect.assertions(2)
      let error: FeathersErrorJSON | null = null
      try {
        await app.service(serviceName).create(weakUser)
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('this password is not strong enought')
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
        .patch(result._id, { yearId: newYear._id })

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
        .patch(result._id, { departmentId: newDepartment._id })

      expect(typeof patchedResult.departmentId).toBe('object')
      expect(patchedResult.departmentId).toEqual(newDepartment._id)
    })

    it('should patch subjectsId', async () => {
      expect.assertions(2)

      const newSubjects: Subject = await app
        .service('subjects')
        .create({ name: 'CC' })

      let patchedResult: User

      patchedResult = (await app
        .service(serviceName)
        .patch(result._id, { favoriteSubjectsIds: newSubjects._id })) as User

      expect(patchedResult.favoriteSubjectsIds).toEqual(
        expect.arrayContaining([newSubjects._id])
      )

      patchedResult = (await app
        .service(serviceName)
        .patch(result._id, { difficultSubjectsIds: newSubjects._id })) as User

      expect(patchedResult.difficultSubjectsIds).toEqual(
        expect.arrayContaining([newSubjects._id])
      )
    })
  })

  describe('manage admin', () => {
    const fakeUser: User = {
      lastName: 'fake',
      firstName: 'usere',
      email: 'fake.user@insa-cvl.fr',
      password: '',
      // User with all permissions
      permissions,
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
    }

    let adminUser: User | null = null

    let userModel: mongoose.Model<mongoose.Document>
    let userInDB: mongoose.Document

    beforeAll(async () => {
      // Connect to db
      try {
        await mongoose.connect(app.get('mongodb'), {
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
      } catch (e) {
        // tslint:disable-next-line
        console.error(e)
      }

      // Create  user schema
      userModel = mongoose.model(
        'User',
        new mongoose.Schema({
          lastName: String,
          firstName: String,
          email: String,
          password: String,
          permissions: [
            {
              type: String,
              enum: ['eleve', 'tuteur', 'admin'],
              required: true,
            },
          ],
        })
      )

      // Create admin
      userInDB = new userModel(fakeUser)
    })

    beforeEach(async () => {
      // Save admin
      await userInDB.save()
      // Retrieve admin user
      const response = (await app.service(serviceName).find({
        query: {
          email: fakeUser.email,
        },
      })) as Paginated<User>

      adminUser = response.data[0]
    })

    afterEach(() => {
      // Delete admin
      userModel.deleteOne({ email: fakeUser.email })
      adminUser = null
    })

    afterAll(async () => {
      await mongoose.connection.close()
    })

    it('should patch permissions but user is still admin', async () => {
      expect.assertions(1)

      // Must contain admin permission
      const newPermissions: UserPermission[] = ['eleve', 'admin']

      // Update users
      const updatedResult: User = await app.service(serviceName).patch(
        adminUser._id,
        { permissions: newPermissions },
        // Add user info to params
        { authenticated: true, user: fakeUser }
      )

      expect(updatedResult.permissions).toStrictEqual(newPermissions)
    })

    it('should loose admin permission', async () => {
      expect.assertions(1)

      const newPermissions: UserPermission[] = ['eleve']
      // Update users
      const updatedResult: User = await app.service(serviceName).patch(
        adminUser._id,
        {
          permissions: newPermissions,
        },
        // Add user info to params
        {
          authenticated: true,
          user: fakeUser,
        }
      )

      expect(updatedResult.permissions).toStrictEqual(newPermissions)
    })
  })

  describe('validate data', () => {
    const user: User = {
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: '$Azerty1',
      permissions,
      yearId: 'data',
      departmentId: 'data',
      favoriteSubjectsIds: ['data'],
      difficultSubjectsIds: ['data'],
    }

    it('should not create because of an empty request', async () => {
      expect.assertions(2)

      let error: Error | null = null
      try {
        // @ts-ignore
        await app.service(serviceName).create()
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe(
        `A data object must be provided to the '${serviceName}.create' method`
      )
    })

    it.each(Object.keys(user))(
      'should not create because of the missing field %s',
      async (key) => {
        expect.assertions(2)

        const tmpUser: User = Object.assign({}, user)
        delete tmpUser[key]

        let error: FeathersErrorJSON | null = null
        try {
          await app.service(serviceName).create(tmpUser)
        } catch (e) {
          error = e
        }

        expect(error).toBeInstanceOf(BadRequest)
        expect(error.message).toBe('some data are missing')
      }
    )

    it.each(Object.keys(user))(
      'should not create because of the wrong type of field %s',
      async (key) => {
        expect.assertions(2)

        const tmpUser: User = Object.assign({}, user)
        tmpUser[key] = 1

        let error: FeathersErrorJSON | null = null
        try {
          await app.service(serviceName).create(tmpUser)
        } catch (e) {
          error = e
        }

        expect(error).toBeInstanceOf(BadRequest)
        expect(error.message).toBe('type of data are incorrect')
      }
    )
  })
})
