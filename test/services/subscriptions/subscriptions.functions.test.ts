import {
  createUserData,
  createPostData,
  patchSubcription,
} from '../../../src/services/subscriptions/subscriptions.functions'
import app from '../../../src/app'
import addDataToUser from '../../utils/addDataToUser'
import createDate from '../../utils/createDate'

import { GeneralError } from '@feathersjs/errors'
import { Id, Params, Paginated } from '@feathersjs/feathers'
import { Room, User, Post } from '../../../src/declarations'

describe("'subscriptions.functions'", () => {
  describe("'createUserData' function", () => {
    it('should have data for a eleve', () => {
      const data = createUserData('eleve', '1')

      expect(data).toHaveProperty('studentSubscriptionsIds', ['1'])
    })
    it('should have data for a tuteur', () => {
      const data = createUserData('tuteur', '2')

      expect(data).toHaveProperty('tutorSubscriptionsIds', ['2'])
    })
  })
  describe("'createPostData' function", () => {
    it('should have data for a eleve', () => {
      const data = createPostData('eleve', '1')

      expect(data).toHaveProperty('studentsIds', ['1'])
    })
    it('should have data for a tuteur', () => {
      const data = createPostData('tuteur', '2')

      expect(data).toHaveProperty('tutorsIds', ['2'])
    })
  })
  describe("'patchSubcription' function", () => {
    let error: Error | null
    let result: Post | null = null

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
      await app.get('mongooseClient').model('rooms').find().deleteMany()
      await app.get('mongooseClient').model('users').find().deleteMany()
      await app.get('mongooseClient').model('posts').find().deleteMany()

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

    beforeEach(() => {
      error = null
    })

    it('shoud patch without error', async () => {
      try {
        await patchSubcription(
          app,
          'posts',
          result._id.toString(),
          {},
          { provider: null }
        )
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
    })

    it('shoud patch with an error', async () => {
      try {
        await patchSubcription(app, 'posts', '5ed7aeea6d584e73604499', {}, {})
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(GeneralError)
      expect(error.message).toBe("can't patch 'posts'")
    })
  })
})
