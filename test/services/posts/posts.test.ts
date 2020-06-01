import app from '../../../src/app'
import { Post, Room, User } from '../../../src/declarations'
import addDataToUser from '../../utils/addDataToUser'
import createDate from '../../utils/createDate'

import { Paginated, Params } from '@feathersjs/feathers'
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

    const params: Params = {}

    const dataRoom: Room = {
      campus: 'blois',
      name: 'E.106',
      day: 'lundi',
      startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
      duration: 120,
    }

    const dataUser: User = {
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: '$Azerty1',
      permissions: ['eleve'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
      createdPostsIds: [],
    }

    let room: Room
    let user: User

    beforeAll(async () => {
      // Delete all the data from the rooms collection
      await app.get('mongooseClient').model(serviceName).find().deleteMany()
      await app.get('mongooseClient').model('rooms').find().deleteMany()
      await app.get('mongooseClient').model('users').find().deleteMany()
      await app.get('mongooseClient').model('calendars').find().deleteMany()

      try {
        room = await app.service('rooms').create(dataRoom)
      } catch (e) {
        // Error
      }
      try {
        await addDataToUser(dataUser)
        user = await app.service('users').create(dataUser)
      } catch (e) {
        // Error
      }
      params.user = user
    })

    beforeEach(async (done) => {
      let results: Paginated<Post>

      post = {
        comment: 'hello post',
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

      results = (await app.service(serviceName).find({
        query: { comment: post.comment },
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

    it('should patch the user after create a post', async () => {
      let users: Paginated<User>
      try {
        users = (await app.service('users').find()) as Paginated<User>
      } catch (e) {
        error = e
      }
      const userFinded = users.data[0]

      expect(userFinded.createdPostsIds.toString()).toBe(result._id.toString())
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
      expect(result.tutorsIds[0].toString()).toBe(params.user._id.toString())
      expect(result.roomId.toString()).toBe(post.roomId)
      expect(result.creatorId.toString()).toBe(params.user._id.toString())

      expect(result).toHaveProperty('createdAt')
      expect(result).toHaveProperty('updatedAt')
    })

    it("should have an 'endAt' property", () => {
      expect(result.endAt).toBeDefined()
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

    // it.todo('should patch the comment')

    it('should delete', async () => {
      expect.assertions(15)

      const deleteResult: Post = await app
        .service(serviceName)
        .remove(result._id, params)

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
      expect(deleteResult.creatorId.toString()).toBe(params.user._id.toString())

      expect(deleteResult).toHaveProperty('createdAt')
      expect(deleteResult).toHaveProperty('updatedAt')
    })
  })
})
