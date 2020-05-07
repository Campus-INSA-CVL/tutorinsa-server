import app from '../../src/app'

const serviceName = 'users'

interface User {
  lastName: string
  firstName: string
  email: string
  password: string
}

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

    const user: User = {
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: 'azerty',
    }

    const anotherUser: User = {
      lastName: 'anotherLastName',
      firstName: 'another',
      email: 'another@insa-cvl.fr',
      password: 'azerty',
    }

    beforeEach(async () => {
      try {
        result = await app.service(serviceName).create(user)
      } catch (error) {
        // tslint:disable-next-line
        console.error(error)
      }
    })

    afterEach(async () => {
      // Delete all the data from the years collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
      result = null
    })

    it('should create', () => {
      expect(result).toBeDefined()
      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('lastName', user.lastName.toLowerCase())
      expect(result).toHaveProperty('firstName', user.firstName.toLowerCase())
      expect(result).toHaveProperty('email', user.email.toLowerCase())

      expect(result.password).not.toBe(user.password)

      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })
  })
})
