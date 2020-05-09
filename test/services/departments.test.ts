import app from '../../src/app'
import {
  MethodNotAllowed,
  FeathersErrorJSON,
  BadRequest,
} from '@feathersjs/errors'

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

    beforeEach(async () => {
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
    })

    afterEach(async () => {
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

  describe('validate data', () => {
    beforeAll(async () => {
      // Delete all the data from the departments collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
    })

    afterEach(async () => {
      // Delete all the data from the departments collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
    })

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

    it('should not create because of invalid data field', async () => {
      expect.assertions(2)

      let error: FeathersErrorJSON | null = null
      try {
        await app.service(serviceName).create({})
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('request must contain correct fields')
    })

    it('should not create because of incorrect type of data', async () => {
      expect.assertions(2)

      let error: FeathersErrorJSON | null = null
      try {
        await app.service(serviceName).create({ name: 2 })
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('name must be a string')
    })

    it('should sanitize data', async () => {
      expect.assertions(1)

      // add spaces
      const result: Department = await app
        .service(serviceName)
        .create({ name: '   STI/  ' })

      expect(result.name).toBe('sti&#x2f;')
    })
  })
})
