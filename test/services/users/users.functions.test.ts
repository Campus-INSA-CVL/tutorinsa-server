import { updateCreatedPostsIds } from '../../../src/services/users/users.functions'
import { User } from '../../../src/declarations'
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
})
