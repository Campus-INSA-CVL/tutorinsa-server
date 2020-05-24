// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { User, CheckPermissionsOptions } from '../../../declarations'

/**
 * Remove admin permission from data if user is not already an admin
 * Remove all unknows permissions
 * Add a default (eleve) permission if permissions is empty
 */
export default (options: CheckPermissionsOptions): Hook => {
  return async (context: HookContext<User>) => {
    const { data, params } = context
    const { user } = params

    if (data?.permissions) {
      data.permissions = data.permissions.filter((permission) =>
        options.permissions.includes(permission)
      )

      if (
        data.permissions.includes(options.admin) &&
        !user?.permissions.includes(options.admin)
      ) {
        data.permissions = data.permissions.filter(
          (permission): boolean => permission !== options.admin
        )
      }

      if (data.permissions.length === 0) {
        data.permissions.push(options.default)
      }
    }
    return context
  }
}
