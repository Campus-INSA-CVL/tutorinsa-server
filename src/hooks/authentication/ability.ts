import { AbilityBuilder, Ability, createAliasResolver } from '@casl/ability'

import { User, ServiceTypes } from '../../declarations'
import { HookContext } from '@feathersjs/feathers'

export type Actions = HookContext['method']
export type Services = keyof ServiceTypes
type AppAbility = Ability<[Actions, Services]>

export default function defineAbilitiesFor(user: User) {
  const { rules, can, cannot } = new AbilityBuilder<AppAbility>()
  // can('find', 'departments')
  // can('find', 'posts')

  // can('find', 'years', ['_id', 'createdAt', 'updatedAt', '__v'])
  // can('find', 'posts', ['_id', 'comment', 'createdAt', 'updatedAt', '__v'])
  // can('get', 'posts', ['_id', 'comment', 'createdAt', 'updatedAt', '__v'])

  // can('create', 'years', ['name'])

  // // @ts-ignore
  // cannot('read', 'years').because('you cannot, be more powerful !')

  return new Ability<[Actions, Services]>(rules)
}
