import { MethodNotAllowed } from '@feathersjs/errors'
import app from '../../src/app'
import mongoose from 'mongoose'
import { Paginated } from '@feathersjs/feathers'

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
      password: 'azerty',
      permissions,
    }

    // User without permissions
    const anotherUser: User = {
      lastName: 'anotherLastName',
      firstName: 'another',
      email: 'another@insa-cvl.fr',
      password: 'azerty',
      // should be empty
      permissions: [],
    }

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

    it('should create a user, with the default permission (eleve)', async () => {
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
      let error: any
      try {
        await app.service(serviceName).update(result._id, anotherUser)
        error = {}
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should update the permission', async () => {
      const newPermission: UserPermission[] = ['eleve']

      const updatedResult: User = await app
        .service(serviceName)
        .patch(result._id, { permissions: newPermission })

      expect(updatedResult.permissions).toStrictEqual(newPermission)
    })
  })

  describe('manage admin', () => {
    const fakeUser: User = {
      lastName: 'fake',
      firstName: 'usere',
      email: 'fake.user@insa-cvl.fr',
      password: '',
      permissions,
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

    it('should update permissions but stay admin', async () => {
      expect.assertions(1)

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
