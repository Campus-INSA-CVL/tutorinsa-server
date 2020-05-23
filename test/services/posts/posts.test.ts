import app from '../../../src/app'
import { Post, Room } from '../../../src/declarations'
import { Paginated } from '@feathersjs/feathers'
import moment from '../../../src/utils/moment'
import { MethodNotAllowed } from '@feathersjs/errors'

const serviceName = 'posts'

describe("'posts' service", () => {
  it('registered the service', () => {
    const service = app.service('posts')
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
    let result: Post | null = null
    let error: Error | null = null

    let post: Post | null = null

    const params = {
      user: {
        _id: '4ccaeb250db44157d84e8c89',
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

    /**
     * Create the perfecte date for the post
     * @returns {string}
     */
    function createDate(): string {
      const date = moment.utc().day('lundi').weekday(7).hour(20).minutes(0)
      return date.toISOString()
    }

    beforeAll(async () => {
      // Delete all the data from the rooms collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
      await app.get('mongooseClient').model('rooms').find().deleteMany()
      await app.get('mongooseClient').model('calendars').find().deleteMany()

      try {
        room = await app.service('rooms').create(dataRoom)
      } catch (e) {
        // Error
      }
    })

    beforeEach(async (done) => {
      let results: Paginated<Post>

      post = {
        comment: 'hello there',
        type: 'eleve',
        startAt: createDate(),
        duration: 60,
        studentsCapacity: 15,
        tutorsCapacity: 2,
        subjectId: '5ccaea940db44157d84e8c93',
        roomId: room._id.toString(),
        studentsIds: ['5ccaea940db44157d84e8c93'],
        tutorsIds: ['5ccaea940db44157d84e8c93'],
        creatorId: '5ccaea940db44157d84e8c93',
      }

      // anotherPost = {}

      results = (await app.service(serviceName).find({
        query: { name: post.comment },
      })) as Paginated<Post>

      result = results.data[0]
      if (!result) {
        try {
          result = (await app.service(serviceName).create(post, params)) as Post
        } catch (e) {
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

      let results: Paginated<Post>
      try {
        // Find data using the Feathersjs service
        results = (await app.service(serviceName).find({})) as Paginated<Post>
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

      expect(result).toBeDefined()
      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('comment', post.comment)
      expect(result).toHaveProperty('type', post.type)
      expect(new Date(result.startAt).toISOString()).toBe(post.startAt)
      expect(result).toHaveProperty('duration', post.duration)
      expect(result).toHaveProperty('studentsCapacity', post.studentsCapacity)
      expect(result).toHaveProperty('tutorsCapacity', post.tutorsCapacity)
      expect(result).toHaveProperty('subjectId')
      expect(result).toHaveProperty('studentsIds')
      expect(result.studentsIds.length).toBeFalsy()
      expect(result).toHaveProperty('tutorsIds')
      expect(result.tutorsIds[0].toString()).toBe(params.user._id)
      expect(result.roomId.toString()).toBe(post.roomId)
      expect(result.creatorId.toString()).toBe(params.user._id)

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

    it.todo('should patch somes fields %s (the field)')

    it('should delete', async () => {
      expect.assertions(15)

      const deleteResult: Post = await app
        .service(serviceName)
        .remove(result._id)

      expect(deleteResult).toBeDefined()
      expect(deleteResult).toHaveProperty('_id')
      expect(deleteResult).toHaveProperty('comment', result.comment)
      expect(deleteResult).toHaveProperty('type', result.type)
      expect(deleteResult).toHaveProperty('startAt', result.startAt)
      expect(deleteResult).toHaveProperty('duration', result.duration)
      expect(deleteResult).toHaveProperty(
        'studentsCapacity',
        result.studentsCapacity
      )
      expect(deleteResult).toHaveProperty(
        'tutorsCapacity',
        result.tutorsCapacity
      )
      expect(deleteResult).toHaveProperty('subjectId')
      expect(deleteResult).toHaveProperty('studentsIds')
      expect(deleteResult).toHaveProperty('tutorsIds')
      expect(deleteResult).toHaveProperty('roomId', result.roomId)
      expect(deleteResult.creatorId.toString()).toBe(params.user._id)

      expect(deleteResult).toHaveProperty('createdAt')
      expect(deleteResult).toHaveProperty('updatedAt')
    })
  })
})
