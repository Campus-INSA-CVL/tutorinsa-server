import app from '../../src/app'
import { MethodNotAllowed } from '@feathersjs/errors'

interface Year {
  _id?: string
  name: string
  createdAt?: string
  updatedAt?: string
}

describe("'years' service", () => {
  it('registered the service', () => {
    const service = app.service('years')
    expect(service).toBeTruthy()
  })

  describe('documentation', () => {
    it('should have a documentation', () => {
      const service = app.service('years')
      expect(service.docs).toBeDefined()
    })
  })

  describe('internal CRUD', () => {
    let result: Year | null = null

    const year = {
      name: '3a',
    }

    const anotherYear = {
      name: '5a',
    }

    beforeEach(async () => {
      try {
        result = await app.service('years').create(year)
      } catch (error) {
        // tslint:disable-next-line
        console.error(error)
      }
    })

    afterEach(async () => {
      // Delete all the data from the years collection
      await app.get('mongooseClient').model('years').find().deleteMany()
      result = null
    })

    it('should find', async () => {
      expect.assertions(4)
      // Find all documents in the DB using mongoose
      const dbResults: any = await app
        .get('mongooseClient')
        .model('years')
        .find()
      const dbLength: number = dbResults.length

      // Find data using the Feathersjs service
      const results: any = await app.service('years').find()

      expect(results).toBeDefined()
      expect(results).toHaveProperty('total', dbLength)
      expect(results).toHaveProperty('data')
      expect(results.data.length).toBe(dbLength)
    })

    it('should create', async () => {
      expect.assertions(5)

      expect(result).toBeDefined()
      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('name', year.name)
      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })

    it('shoult not update (disallow)', async () => {
      expect.assertions(1)
      let error: any
      try {
        await app.service('years').update(result._id, anotherYear)
        error = {}
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should patch', async () => {
      expect.assertions(5)

      const patchedResult = await app
        .service('years')
        .patch(result._id, anotherYear)

      expect(patchedResult).toBeDefined()
      expect(patchedResult).toHaveProperty('_id')
      expect(patchedResult).toHaveProperty('name', anotherYear.name)
      expect(patchedResult).toHaveProperty('createdAt')
      expect(patchedResult).toHaveProperty('updatedAt')
    })

    it('should delete', async () => {
      expect.assertions(5)

      const deleteResult = await app.service('years').remove(result._id)

      expect(deleteResult).toBeDefined()
      expect(deleteResult).toHaveProperty('_id')
      expect(deleteResult).toHaveProperty('name', result.name)
      expect(deleteResult).toHaveProperty('createdAt')
      expect(deleteResult).toHaveProperty('updatedAt')
    })
  })
})
