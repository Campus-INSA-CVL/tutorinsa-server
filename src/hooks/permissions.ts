// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'

export default (options = {}): Hook => {
  return async (context: HookContext<User>) => {
    const { data, params } = context
    const { user } = params

    if (
      data?.permissions?.includes('admin') &&
      !user?.permissions.includes('admin')
    ) {
      data.permissions = data.permissions.filter(
        (permission: UserPermission): boolean => permission !== 'admin'
      )
    }

    if (data?.permissions?.length === 0) {
      data.permissions.push('eleve')
    }

    return context
  }
}
