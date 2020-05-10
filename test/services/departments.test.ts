import app from '../../src/app'
import { MethodNotAllowed, FeathersErrorJSON } from '@feathersjs/errors'
import { Department } from '../../src/declarations'

const serviceName = 'departments'

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
    let result: Department | null = null

    const department: Department = {
      name: 'STPI',
    }

    const anotherDepartment: Department = {
      name: 'sti',
    }

    beforeAll(async () => {
      // Delete all the data from the departments collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
    })

    beforeEach(async (done) => {
      let results: Department[]

      results = (await app.service(serviceName).find({
        query: { name: department.name.toLowerCase() },
      })) as Department[]

      result = results[0]
      if (!result) {
        try {
          result = (await app
            .service(serviceName)
            .create({ name: department.name })) as Department
        } catch (error) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }
      done()
    })

    afterEach(() => {
      result = null
    })

    it('should find', async () => {
      expect.assertions(3)
      // Find all documents in the DB using mongoose
      const dbResults: any = await app
        .get('mongooseClient')
        .model(serviceName)
        .find()
      const dbLength: number = dbResults.length

      // Find data using the Feathersjs service
      const results = (await app.service(serviceName).find()) as Department[]

      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBeTruthy()
      expect(results.length).toBe(dbLength)
    })

    it('should create', () => {
      expect(result).toBeDefined()
      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('name', department.name.toLowerCase())
      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })

    it('should not update (disallow)', async () => {
      expect.assertions(1)
      let error: FeathersErrorJSON | null = null
      try {
        await app.service(serviceName).update(result._id, anotherDepartment)
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should patch', async () => {
      expect.assertions(5)

      const patchedResult: Department = await app
        .service(serviceName)
        .patch(result._id, anotherDepartment)

      expect(patchedResult).toBeDefined()
      expect(patchedResult).toHaveProperty('_id')
      expect(patchedResult).toHaveProperty(
        'name',
        anotherDepartment.name.toLowerCase()
      )
      expect(patchedResult).toHaveProperty('createdAt')
      expect(patchedResult).toHaveProperty('updatedAt')
    })

    it('should delete', async () => {
      expect.assertions(5)

      const deleteResult: Department = await app
        .service(serviceName)
        .remove(result._id)

      expect(deleteResult).toBeDefined()
      expect(deleteResult).toHaveProperty('_id')
      expect(deleteResult).toHaveProperty('name', result.name.toLowerCase())
      expect(deleteResult).toHaveProperty('createdAt')
      expect(deleteResult).toHaveProperty('updatedAt')
    })
  })
})
