import app from '../../src/app'
import { Room } from '../../src/declarations'
import { Paginated } from '@feathersjs/feathers'
import { MethodNotAllowed } from '@feathersjs/errors'

const serviceName = 'rooms'

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
    let result: Room | null = null
    let error: Error | null = null

    let room: Room | null = null
    let anotherRoom: Room | null = null

    beforeAll(async () => {
      // Delete all the data from the rooms collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
    })

    beforeEach(async (done) => {
      let results: Paginated<Room>

      room = {
        campus: 'blois',
        name: 'E.106',
        day: 'lundi',
        startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
        duration: 120,
      }

      anotherRoom = {
        campus: 'bourges',
        name: 'SA.04',
        day: 'mardi',
        startAt: 'Mon May 11 2020 17:30:00 GMT+0000',
        duration: 150,
      }

      results = (await app.service(serviceName).find({
        query: { name: room.name.toLowerCase() },
      })) as Paginated<Room>

      result = results.data[0]
      if (!result) {
        try {
          result = (await app.service(serviceName).create(room)) as Room
        } catch (error) {
          // Do nothing, it just means the room already exists and can be tested
        }
      }
      done()
    })

    afterEach(() => {
      result = null
      error = null
    })
    it('should find', async () => {
      expect.assertions(4)
      // Find all documents in the DB using mongoose
      const dbResults: any = await app
        .get('mongooseClient')
        .model(serviceName)
        .find()
      const dbLength: number = dbResults.length

      let results: Paginated<Room>
      try {
        // Find data using the Feathersjs service
        results = (await app.service(serviceName).find()) as Paginated<Room>
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(results).toBeDefined()
      expect(results).toHaveProperty('total', dbLength)
      expect(Array.isArray(results.data)).toBeTruthy()
    })
    it('should create', () => {
      expect(result).toBeDefined()

      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('campus', room.campus)
      expect(result).toHaveProperty('name', room.name.toLowerCase())
      expect(result).toHaveProperty('day', room.day)
      expect(result).toHaveProperty('startAt')
      expect(result).toHaveProperty('duration', room.duration)

      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })
    it('should not update (disallow)', async () => {
      expect.assertions(1)
      try {
        await app.service(serviceName).update(result._id, anotherRoom)
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })
    it.each([
      ['campus', 'bourges'],
      ['name', 'a.10'],
      ['day', 'mercredi'],
      ['startAt', 'Tue May 12 2020 19:00:00 GMT+0000'],
      ['duration', 30],
    ])('should patch %s', async (key, value) => {
      const patch = {}
      patch[key] = value

      let patchedResult: Room

      try {
        patchedResult = (await app
          .service(serviceName)
          .patch(result._id, patch)) as Room
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      if (key === 'startAt') {
        expect(new Date(patchedResult[key]).toISOString()).toEqual(
          new Date(value).toISOString()
        )
      } else {
        expect(patchedResult[key]).toEqual(value)
      }
    })
    it('should remove', async () => {
      expect.assertions(9)

      const deletedResult: Room = await app
        .service(serviceName)
        .remove(result._id)

      expect(result).toBeDefined()

      expect(deletedResult).toHaveProperty('_id', result._id)
      expect(deletedResult).toHaveProperty('campus')
      expect(deletedResult).toHaveProperty('name')
      expect(deletedResult).toHaveProperty('day')
      expect(deletedResult).toHaveProperty('startAt')
      expect(deletedResult).toHaveProperty('duration')

      expect(deletedResult).toHaveProperty('createdAt')
      expect(deletedResult).toHaveProperty('updatedAt')
    })
  })
})
