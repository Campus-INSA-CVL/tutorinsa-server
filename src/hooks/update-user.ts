// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Id } from '@feathersjs/feathers'
import { Post, User, Application, UserCore, PostCore } from '../declarations'
import { GeneralError, NotAuthenticated } from '@feathersjs/errors'

/**
 * Create data by associating key (from a user) value (to a post) pairs
 * @param {string[][]} options selected fields and associated
 * @param {Post} result a post to pick field
 * @returns {Partial<User>}
 */
function createData(options: string[][], result: Post): Partial<User> {
  const data: Partial<User> = {}
  options.forEach((option) => {
    if (!result[option[1]]) {
      throw new GeneralError("can't find this field on the result")
    }

    if (option[2] === 'array') {
      if (Array.isArray(result[option[1]])) {
        data[option[0]] = [...(result[option[1]] as string[])]
      } else {
        data[option[0]] = [result[option[1]] as string]
      }
    } else if (option[2] === 'string') {
      data[option[0]] = result[option[1]]
    }
  })
  return data
}

/**
 * Send the request to patch the user
 * @param {Application} app
 * @param {User} user
 * @param {Partial<User>} data
 */
async function patchUser(app: Application, user: User, data: Partial<User>) {
  try {
    await app.service('users').patch((user as User)._id!, data, {})
  } catch (e) {
    throw new GeneralError('an error occured when the user was updated')
  }
}

// check if it's possible in typescript to us to have keyof User despite of indexable type
/**
 * Update the auth user, using the array passed in options and the result
 */
export default (
  options: [keyof UserCore, keyof PostCore, 'array' | 'string'][]
): Hook => {
  return async (context: HookContext<Post>) => {
    const { app, params, result } = context
    const { user } = params

    if (!user?._id) {
      throw new NotAuthenticated(
        'a user must be authenticated to patch his data'
      )
    }

    if (!result) {
      throw new GeneralError(
        'something went wrong with the post creation (no result)'
      )
    }

    const data = createData(options, result)

    await patchUser(app as Application, user, data)

    return context
  }
}
