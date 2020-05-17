import { getUserId } from '../../../src/services/posts/posts.functions'
import { NotAuthenticated, GeneralError } from '@feathersjs/errors'
import { Id } from '@feathersjs/feathers'
describe("'posts.functions'", () => {
  describe("'getUserId' function", () => {
    let error: Error | null
    let result: Id

    beforeEach(() => {
      error = null
    })

    it('should throw an error without user', () => {
      try {
        getUserId({})
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(NotAuthenticated)
      expect(error.message).toBe('must be authenticated to create a post')
    })
    it('should throw an error without user Id', () => {
      try {
        getUserId({
          user: {
            name: 'fake',
          },
        })
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(GeneralError)
      expect(error.message).toBe("can't access to the user id")
    })
    it('should retrun the user id', () => {
      const params = {
        user: { _id: 'az1234', name: 'fake' },
      }

      try {
        result = getUserId(params)
      } catch (e) {
        error = e
      }
      expect(error).toBeNull()
      expect(result).toBe(params.user._id)
    })
  })
})
