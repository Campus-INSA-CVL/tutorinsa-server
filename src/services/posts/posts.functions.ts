import { Params, Id } from '@feathersjs/feathers'
import { NotAuthenticated, GeneralError } from '@feathersjs/errors'
import { User } from '../../declarations'

/**
 * Get the user id from params
 * @param params
 * @returns Id
 */
function getUserId(params: Params): Id {
  const { user } = params
  if (!user) {
    throw new NotAuthenticated('must be authenticated to create a post')
  } else if (!(user as User)._id) {
    throw new GeneralError("can't access to the user id")
  } else {
    return (user as User)._id!
  }
}

export { getUserId }
