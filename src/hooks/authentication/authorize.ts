// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { AbilityBuilder, Ability, createAliasResolver } from '@casl/ability'
import { Forbidden } from '@feathersjs/errors'

import { User, Department } from '../../declarations'

type Actions = 'create' | 'read' | 'update' | 'delete'
type Services = Department | 'Department'
type AppAbility = Ability<[Actions, Services]>

createAliasResolver({
  read: ['get', 'find'],
})

function defineAbilitiesFor(user: User) {
  const { rules, can, cannot } = new AbilityBuilder<AppAbility>()

  can('delete', 'Department')

  return new Ability<[Actions, Services]>(rules)
}

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { params } = context
    const { user } = params

    const ability = defineAbilitiesFor(user)

    if (!ability.can('read', 'Department')) {
      throw new Forbidden("you can't")
    }

    return context
  }
}
