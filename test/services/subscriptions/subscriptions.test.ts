import app from '../../../src/app'
import { MethodNotAllowed, Forbidden } from '@feathersjs/errors'
import addDataToUser from '../../utils/addDataToUser'
import createDate from '../../utils/createDate'
import { Paginated, Params } from '@feathersjs/feathers'
import { Post, Room, User, Subscription } from '../../../src/declarations'
import patchUser from '../../../src/hooks/user/patch-user'

const serviceName = 'subscriptions'

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
      permissions: ['tuteur'],
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
      await app.get('mongooseClient').model('posts').find().deleteMany()
      await app.get('mongooseClient').model('rooms').find().deleteMany()
      await app.get('mongooseClient').model('users').find().deleteMany()

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

      let results: Paginated<Post>

      post = {
        comment: 'hello post',
        type: 'tuteur',
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

      results = (await app.service('posts').find({
        query: { comment: post.comment },
      })) as Paginated<Post>

      result = results.data[0]
      if (!result) {
        try {
          result = (await app.service('posts').create(post, params)) as Post
        } catch (e) {
          // Do nothing, it just means the room already exists and can be tested
        }
      }
    })

    afterEach(() => {
      error = null
    })

    it('should not find (disallow)', async () => {
      expect.assertions(1)
      try {
        await app.service(serviceName).find()
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should not get (disallow external)', async () => {
      expect.assertions(1)
      try {
        await app
          .service(serviceName)
          .get('5ed7aeea6d584e7360449989', { provider: 'external' })
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(Forbidden)
    })

    it('should not create (disallow)', async () => {
      expect.assertions(1)
      try {
        await app
          .service(serviceName)
          .create({ type: 'subscribe', as: 'eleve' })
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should not update (disallow)', async () => {
      expect.assertions(1)
      try {
        await app.service(serviceName).update('5ed7aeea6d584e7360449989', {
          type: 'subscribe',
          as: 'eleve',
        })
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should not remove (disallow)', async () => {
      expect.assertions(1)
      try {
        await app.service(serviceName).remove('5ed7aeea6d584e7360449989')
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(MethodNotAllowed)
    })

    it('should subscribe a user to a post', async () => {
      expect.assertions(5)

      const data: Subscription = {
        as: 'tuteur',
        type: 'subscribe',
      }

      try {
        await app
          .service(serviceName)
          .patch(result._id.toString(), data, params)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      const patchedUser = (await app.service('users').get(user._id)) as User
      const patchedPost = (await app
        .service('posts')
        .get(result._id, {})) as Post

      expect(patchedUser.studentSubscriptionsIds.length).toBe(0)
      expect(patchedUser.tutorSubscriptionsIds[0].toString()).toBe(
        result._id.toString()
      )
      expect(patchedPost.studentsIds.length).toBe(0)
      expect(patchedPost.tutorsIds[0].toString()).toBe(user._id.toString())
    })

    it('should unsubscribe a user to a post', async () => {
      expect.assertions(5)

      const data: Subscription = {
        as: 'tuteur',
        type: 'unsubscribe',
      }

      try {
        await app
          .service(serviceName)
          .patch(result._id.toString(), data, params)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      const patchedUser = (await app.service('users').get(user._id)) as User
      const patchedPost = (await app
        .service('posts')
        .get(result._id, {})) as Post

      expect(patchedUser.studentSubscriptionsIds.length).toBe(0)
      expect(patchedUser.tutorSubscriptionsIds.length).toBe(0)
      expect(patchedPost.studentsIds.length).toBe(0)
      expect(patchedPost.tutorsIds.length).toBe(0)
    })
  })
})
