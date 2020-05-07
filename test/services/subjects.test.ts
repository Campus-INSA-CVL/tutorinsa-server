import app from '../../src/app'
import { MethodNotAllowed } from '@feathersjs/errors'

const serviceName = 'subjects'

interface Subjects {
  _id?: string
  name: string
  createdAt?: string
  updatedAt?: string
}

describe(`'${serviceName}' service`, () => {
  it('registered the service', () => {
    const service = app.service('subjects')
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
    let result: Subjects | null = null

    const subject = {
      name: 'CC',
    }

    const anotherSubject = {
      name: 'eps',
    }

    beforeEach(async () => {
      try {
        result = await app.service(serviceName).create(subject)
      } catch (error) {
        // tslint:disable-next-line
        console.error(error)
      }
    })

    afterEach(async () => {
      // Delete all the data from the subjects collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
      result = null
    })

    it('should find', async () => {
      expect.assertions(4)
      // Find all documents in the DB using mongoose
      const dbResults: any = await app
        .get('mongooseClient')
        .model(serviceName)
        .find()
      const dbLength: number = dbResults.length

      // Find data using the Feathersjs service
      const results: any = await app.service(serviceName).find()

      expect(results).toBeDefined()
      expect(results).toHaveProperty('total', dbLength)
      expect(results).toHaveProperty('data')
      expect(results.data.length).toBe(dbLength)
    })

    it('should create', async () => {
      expect.assertions(5)

      expect(result).toBeDefined()
      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('name', subject.name.toLowerCase())
      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })

    it('should not update (disallow)', async () => {
      expect.assertions(1)
      let error: any
      try {
        await app.service(serviceName).update(result._id, anotherSubject)
        error = {}
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should patch', async () => {
      expect.assertions(5)

      const patchedResult = await app
        .service(serviceName)
        .patch(result._id, anotherSubject)

      expect(patchedResult).toBeDefined()
      expect(patchedResult).toHaveProperty('_id')
      expect(patchedResult).toHaveProperty(
        'name',
        anotherSubject.name.toLowerCase()
      )
      expect(patchedResult).toHaveProperty('createdAt')
      expect(patchedResult).toHaveProperty('updatedAt')
    })

    it('should delete', async () => {
      expect.assertions(5)

      const deleteResult = await app.service(serviceName).remove(result._id)

      expect(deleteResult).toBeDefined()
      expect(deleteResult).toHaveProperty('_id')
      expect(deleteResult).toHaveProperty('name', result.name.toLowerCase())
      expect(deleteResult).toHaveProperty('createdAt')
      expect(deleteResult).toHaveProperty('updatedAt')
    })
  })
})
