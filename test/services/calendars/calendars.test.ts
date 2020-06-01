import app from '../../../src/app'
import { MethodNotAllowed } from '@feathersjs/errors'
import { Calendar, Room, Post } from '../../../src/declarations'
import { Paginated, Params, HookContext } from '@feathersjs/feathers'

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
      room: {},
      post: {
        startAt: '2020-05-18T20:00:00.000Z',
        duration: 30,
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
        dataCalendars.room = room
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
      error = null
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
      expect(result).toHaveProperty('startAt')
      expect(result).toHaveProperty('roomId', room._id)
      expect(result).toHaveProperty('duration', room.duration)

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

    it('should patch (create)', async () => {
      expect.assertions(3)

      const params: Params & { from: HookContext['method'] } = {
        from: 'create',
      }

      const data: { post: Post; calendar: Calendar } = {
        post: {
          startAt: '2020-05-18T20:30:00.000Z',
          duration: 30,
          _id: '6b8aaba8e9af1629a471468a',
        } as Post,

        calendar: result,
      }

      let calendar: Calendar
      try {
        calendar = await app
          .service(serviceName)
          .patch(result._id, data, params)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(calendar.slots.length).toBe(2)
      expect(calendar.slots[1].postId.toString()).toBe(data.post._id)
    })

    it('should patch (patch)', async () => {
      expect.assertions(3)

      const params: Params & { from: HookContext['method'] } = {
        from: 'patch',
      }

      const data: { post: Post; calendar: Calendar } = {
        post: {
          startAt: '2020-05-18T20:30:00.000Z',
          duration: 30,
          _id: '6b8aaba8e9af1629a471468a',
        } as Post,

        calendar: result,
      }

      let calendar: Calendar
      try {
        calendar = await app
          .service(serviceName)
          .patch(result._id, data, params)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(calendar.slots.length).toBe(2)
      expect(calendar.slots[1].postId.toString()).toBe(data.post._id)
    })

    it('should patch (remove)', async () => {
      expect.assertions(2)

      const params: Params & { from: HookContext['method'] } = {
        from: 'remove',
      }

      const data: { post: Post; calendar: Calendar } = {
        post: dataCalendars.post as Post,
        calendar: result,
      }

      let calendar: Calendar
      try {
        calendar = await app
          .service(serviceName)
          .patch(result._id, data, params)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(calendar.slots.length).toBe(0)
    })

    it('should thow an error if from is not provided', async () => {
      expect.assertions(2)

      const params = {
        from: 'somewhere',
      }

      try {
        await app
          .service(serviceName)
          // @ts-ignore
          .patch(result._id, {} as { post: Post; calendar: Calendar }, params)
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe(`'${params.from}' is not valid, unknow source`)
    })

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
        duration: 30,
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
        dataCalendars.room = room
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
