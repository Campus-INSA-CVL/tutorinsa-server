import { MethodNotAllowed, BadRequest } from '@feathersjs/errors'
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
      // Create data to put in users
      const year = (await app.service('years').create({ name: '3A' })) as Year
      const department = (await app
        .service('departments')
        .create({ name: 'STPI' })) as Department
      const subject = (await app
        .service('subjects')
        .create({ name: 'EPS' })) as Subject

      user.yearId = year._id as string
      user.departmentId = department._id as string
      user.favoriteSubjectsIds.push(subject._id as string)
      user.difficultSubjectsIds.push(subject._id as string)

      anotherUser.yearId = year._id as string
      anotherUser.departmentId = department._id as string
      anotherUser.favoriteSubjectsIds.push(subject._id as string)
      anotherUser.difficultSubjectsIds.push(subject._id as string)

      weakUser.yearId = year._id as string
      weakUser.departmentId = department._id as string
      weakUser.favoriteSubjectsIds.push(subject._id as string)
      weakUser.difficultSubjectsIds.push(subject._id as string)
    })

    afterAll(async () => {
      await app.get('mongooseClient').model('subjects').find().deleteMany()
      await app.get('mongooseClient').model('departments').find().deleteMany()
      await app.get('mongooseClient').model('years').find().deleteMany()
    })

    beforeEach(async () => {
      try {
        result = (await app.service(serviceName).create(user)) as User
      } catch (error) {
        // tslint:disable-next-line
        console.error(error)
      }
    })

    afterEach(async () => {
      // Delete all the data from the users collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
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
      let error: any
      try {
        await app.service(serviceName).create(weakUser)
        error = {}
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('this password is not strong enought')
    })

    it('should not update (disallow)', async () => {
      expect.assertions(1)
      let error: any
      try {
        await app.service(serviceName).update(result._id, anotherUser)
        error = {}
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

    afterAll(() => {
      mongoose.connection.close()
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
})
