import {
  updateCreatedPostsIds,
  updateSubcriptions,
} from '../../../src/services/users/users.functions'
import { User, Post, Subscription } from '../../../src/declarations'
import { GeneralError } from '@feathersjs/errors'

describe("'users.fuctions'", () => {
  describe("'updateCreatedPostsIds' function", () => {
    let user: User
    let error: Error | null

    beforeEach(() => {
      user = {
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

      error = null
    })

    it('nothing should happend without createdPostsJds', () => {
      let data: Partial<User>
      try {
        data = updateCreatedPostsIds({}, user)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(data).toEqual({})
    })

    it('should add the data', () => {
      let data: Partial<User>
      try {
        data = updateCreatedPostsIds(
          // @ts-ignore
          { createdPostsIds: '5ccaea940db44157d84e8c93' },
          user
        )
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(data.createdPostsIds[0]).toBe('5ccaea940db44157d84e8c93')
    })

    it('should remove the data', () => {
      let data: Partial<User>

      user.createdPostsIds = [Object('5ccaea940db44157d84e8c93')]
      try {
        data = updateCreatedPostsIds(
          // @ts-ignore
          { createdPostsIds: '5ccaea940db44157d84e8c93' },
          user
        )
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(data.createdPostsIds[0]).toBeUndefined()
    })

    it('should throw a error if more than one post id is provided', () => {
      let data: Partial<User>
      try {
        data = updateCreatedPostsIds(
          { createdPostsIds: ['data', 'data'] },
          user
        )
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(GeneralError)
      expect(error.message).toBe(
        'only one post id can be provided to patch a user'
      )
    })
  })

  describe("'updateSubcriptions' function", () => {
    let user: User
    let error: Error | null
    let result

    beforeEach(() => {
      user = {
        lastName: 'fakeLastName',
        firstName: 'username',
        email: 'username@insa-cvl.fr',
        password: '$Azerty1',
        permissions: ['eleve'],
        yearId: '',
        departmentId: '',
        favoriteSubjectsIds: [],
        difficultSubjectsIds: [],
        studentSubscriptionsIds: [
          '6bcaea560db44157d49e8a35',
          '5decea940db44157d84e4b48',
        ],
        tutorSubscriptionsIds: ['7aabea940db44157d84e8a56'],
        createdPostsIds: [],
      }

      error = null
      result = null
    })

    it('nothing should happend without data', () => {
      try {
        result = updateSubcriptions(undefined as User, user, {})
      } catch (e) {
        error = e
      }
      expect(result).toBeUndefined()
      expect(error).toBeNull()
    })
    it('nothing should happend without subType in params', () => {
      try {
        result = updateSubcriptions({} as User, user, {})
      } catch (e) {
        error = e
      }
      expect(result).toEqual({})
      expect(error).toBeNull()
    })

    it('should throw an error if type is incorrect', () => {
      const data = {
        studentSubscriptionsIds: ['5ccaea940db44157d84e8c93'],
      }
      const params = {
        subType: 'usubscribe' as Subscription['type'],
        post: {} as Post,
      }

      try {
        result = updateSubcriptions(data, user, params)
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(GeneralError)
      expect(error.message).toBe(
        `'${params.subType}' this type is unknow (subscription service)`
      )
    })

    it('should return the correct array (subscribe)', () => {
      const data = {
        studentSubscriptionsIds: ['5ccaea940db44157d84e8c93'],
      }
      const params = {
        subType: 'subscribe' as Subscription['type'],
      }

      try {
        result = updateSubcriptions(data, user, params)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result).not.toEqual(
        expect.arrayContaining([
          ...user.studentSubscriptionsIds,
          ...data.studentSubscriptionsIds,
        ])
      )
    })

    it('should not subscribe twice', () => {
      const data = {
        studentSubscriptionsIds: ['5ccaea940db44157d84e8c93'],
      }
      const params = {
        subType: 'subscribe' as Subscription['type'],
      }

      // subscribe once
      user.studentSubscriptionsIds = [
        ...user.studentSubscriptionsIds,
        ...data.studentSubscriptionsIds,
      ]

      // subscribe twice
      try {
        result = updateSubcriptions(data, user, params)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result).not.toEqual(
        expect.arrayContaining([...user.studentSubscriptionsIds])
      )
    })

    it('should return the correct array (unsubscribe)', () => {
      const data = {
        studentSubscriptionsIds: ['5ccaea940db44157d84e8c93'],
      }
      user.studentSubscriptionsIds = [
        ...data.studentSubscriptionsIds,
        ...user.studentSubscriptionsIds,
      ]
      const params = {
        subType: 'unsubscribe' as Subscription['type'],
      }

      try {
        result = updateSubcriptions(data, user, params)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result).toEqual(
        expect.not.arrayContaining(data.studentSubscriptionsIds)
      )
    })
  })
})
