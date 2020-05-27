import { User } from '../../declarations'
import { GeneralError } from '@feathersjs/errors'
import { Id } from '@feathersjs/feathers'

/**
 * Return an array without the post id
 * @param {Id} postId
 * @param {User} user
 * @returns {User['createdPostsIds']} an array without the post id but with the other from the user
 */
function removePostId(postId: Id, user: User): User['createdPostsIds'] {
  return [
    ...user.createdPostsIds.filter(
      (createdPostId) => createdPostId.toString() !== postId.toString()
    ),
  ]
}

/**
 * Return an array with the new and previous post id
 * @param {Id} postId
 * @param {User} user
 * @returns {User['createdPostsIds']} a array containing the new post id and the previous from the user
 */
function addPostId(postId: Id, user: User): User['createdPostsIds'] {
  return [...user.createdPostsIds, postId]
}

/**
 * Add or remove a post id from data to patch the createdPostsIds field from the user
 * @param {Partial<User>} data some fields from a user used to patch a user
 * @param {User} user
 * @returns {Partial<User>} the updated data
 */
function updateCreatedPostsIds(data: Partial<User>, user: User): Partial<User> {
  if (data.createdPostsIds) {
    if (typeof data.createdPostsIds === 'string') {
      data.createdPostsIds = [data.createdPostsIds]
    }

    if (data.createdPostsIds.length > 1) {
      throw new GeneralError('only one post id can be provided to patch a user')
    }

    if (
      user.createdPostsIds.find(
        (createdPostId) =>
          createdPostId.toString() === data.createdPostsIds!.toString()
      )
    ) {
      data.createdPostsIds = removePostId(data.createdPostsIds[0], user)
    } else {
      data.createdPostsIds = addPostId(data.createdPostsIds[0], user)
    }
  }
  return data
}

export { updateCreatedPostsIds }
