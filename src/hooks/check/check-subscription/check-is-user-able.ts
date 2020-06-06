// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { UserPermission, User, Subscription } from '../../../declarations'
import { BadRequest } from '@feathersjs/errors'

/**
 * Check that the user have the permission to sub or unsub
 * @param {Subscription['as']} as
 * @param {UserPermission[]} userPermissions
 */
function checkUserAbility(
  as: Subscription['as'],
  userPermissions: UserPermission[]
): void {
  if (!userPermissions.includes(as)) {
    throw new BadRequest(`you must be a '${as}' to do this`)
  }
}

/**
 * Return permissions from a user
 * @param {User} user
 * @returns {UserPermissions[]}
 */
function getUserPermissions(user: User): UserPermission[] {
  return user.permissions
}

/**
 * Check that the user have the permission to sub or unsub
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Subscription>) => {
    const { data, params } = context
    const { user } = params

    if (data) {
      if (!user) {
        throw new BadRequest(`you must be authenticated`)
      }

      const userPermissions = getUserPermissions(user as User)
      checkUserAbility(data.as, userPermissions)
    }

    return context
  }
}
