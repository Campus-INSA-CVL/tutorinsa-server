import app from '../../../src/app'
import { MethodNotAllowed, FeathersErrorJSON } from '@feathersjs/errors'
import { Calendar, Room, Post } from '../../../src/declarations'
import { Paginated } from '@feathersjs/feathers'

const serviceName = 'calendars'

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
    let result: Calendar | null = null
    let error: Error | null = null

    const dataCalendars: any = {
      roomId: '',
      post: {
        startAt: '2020-05-18T20:00:00.000Z',
        duration: 60,
        _id: '5e7baba8e9af1629a471468d',
      },
    }

    const dataRoom: Room = {
      campus: 'blois',
      name: 'E.106',
      day: 'lundi',
      startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
      duration: 120,
    }

    let room: Room

    beforeAll(async () => {
      // Delete all the data from the departments collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
      await app.get('mongooseClient').model('rooms').find().deleteMany()

      try {
        room = await app.service('rooms').create(dataRoom)
        dataCalendars.roomId = room._id.toString()
      } catch (e) {
        // Error
      }
    })

    beforeEach(async (done) => {
      let results: Calendar[]

      results = (await app.service(serviceName).find({
        query: { roomId: room._id },
      })) as Calendar[]

      result = results[0]
      if (!result) {
        try {
          result = (await app
            .service(serviceName)
            .create(
              dataCalendars as { post: Post; room: Room },
              {}
            )) as Calendar
        } catch (e) {
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
      const results = (await app.service(serviceName).find()) as Paginated<
        Calendar
      >

      expect(results).toBeDefined()
      expect(Array.isArray(results.data)).toBeTruthy()
      expect(results.data.length).toBe(dbLength)
    })

    it('should create', () => {
      expect(result).toBeDefined()
      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('startAt')
      expect(result).toHaveProperty('roomId', result.roomId)
      expect(result).toHaveProperty('slots')

      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })

    it('should not update (disallow)', async () => {
      expect.assertions(1)
      try {
        await app.service(serviceName).update(result._id, {})
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should not patch (disallow)', async () => {
      expect.assertions(1)
      try {
        await app
          .service(serviceName)
          .patch(result._id, {} as { post: Post; calendar: Calendar }, {
            from: 'patch',
          })
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it.todo('should patch %s (add et remove)')

    it('should delete', async () => {
      expect.assertions(7)

      const deleteResult: Calendar = await app
        .service(serviceName)
        .remove(result._id)

      expect(deleteResult).toBeDefined()
      expect(deleteResult).toHaveProperty('_id')
      expect(deleteResult).toHaveProperty('startAt')
      expect(deleteResult).toHaveProperty('roomId', result.roomId)
      expect(deleteResult).toHaveProperty('slots')

      expect(deleteResult).toHaveProperty('createdAt')
      expect(deleteResult).toHaveProperty('updatedAt')
    })
  })

  describe('external CRUD', () => {
    let result: Calendar | null = null
    let error: Error | null = null

    const dataCalendars: any = {
      roomId: '',
      post: {
        startAt: '2020-05-18T20:00:00.000Z',
        duration: 60,
        _id: '5e7baba8e9af1629a471468d',
      },
    }

    const dataRoom: Room = {
      campus: 'blois',
      name: 'E.106',
      day: 'lundi',
      startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
      duration: 120,
    }

    let room: Room

    const params = { provider: 'rest' }

    beforeAll(async () => {
      // Delete all the data from the departments collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
      await app.get('mongooseClient').model('rooms').find().deleteMany()

      try {
        room = await app.service('rooms').create(dataRoom)
        dataCalendars.roomId = room._id.toString()
      } catch (e) {
        // Error
      }
    })

    beforeEach(async (done) => {
      let results: Calendar[]

      results = (await app.service(serviceName).find({
        query: { roomId: room._id },
      })) as Calendar[]

      result = results[0]
      if (!result) {
        try {
          result = (await app
            .service(serviceName)
            .create(
              dataCalendars as { post: Post; room: Room },
              {}
            )) as Calendar
        } catch (e) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }
      done()
    })

    afterEach(() => {
      result = null
    })
    it('should not create (disallow external)', async () => {
      expect.assertions(1)
      try {
        await app.service(serviceName).update(result._id, params)
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })
    it('should not remove (disallow external)', async () => {
      expect.assertions(1)
      try {
        await app.service(serviceName).update(result._id, params)
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })
  })
})
