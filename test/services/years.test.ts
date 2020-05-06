import app from '../../src/app'

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
        console.error(error)
      }
    })

    afterEach(async () => {
      // Delete all the data from the years collection
      await app.get('mongooseClient').model('years').find().deleteMany()
      result = null
    })

    it('should find a year', async () => {
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

    it('should create a year', async () => {
      expect(result).toBeDefined()
      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('name', year.name)
      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })

    it('should update a year', async () => {
      const updatedResult = await app
        .service('years')
        .patch(result._id, anotherYear)

      expect(updatedResult).toBeDefined()
      expect(updatedResult).toHaveProperty('_id')
      expect(updatedResult).toHaveProperty('name', anotherYear.name)
      expect(updatedResult).toHaveProperty('createdAt')
      expect(updatedResult).toHaveProperty('updatedAt')
    })

    it('should delete a year', async () => {
      const deleteResult = await app.service('years').remove(result._id)

      expect(deleteResult).toBeDefined()
      expect(deleteResult).toHaveProperty('_id')
      expect(deleteResult).toHaveProperty('name', result.name)
      expect(deleteResult).toHaveProperty('createdAt')
      expect(deleteResult).toHaveProperty('updatedAt')
    })
  })
})
