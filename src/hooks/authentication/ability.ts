import { AbilityBuilder, Ability } from '@casl/ability'
import { HookContext } from '@feathersjs/feathers'

import { User, ServiceTypes } from '../../declarations'
import moment from '../../utils/moment'

export type Actions = HookContext['method']
export type Services = keyof ServiceTypes
type AppAbility = Ability<[Actions, Services]>

export default function defineAbilitiesFor(user: User) {
  const { rules, can } = new AbilityBuilder<AppAbility>()
  can(
    ['find', 'get'],
    ['subjects', 'departments', 'years'],
    ['_id', 'name', '__v']
  )

  can('create', 'users', [
    'lastName',
    'firstName',
    'email',
    'password',
    'permissions',
    'yearId',
    'departmentId',
    'favoriteSubjectsIds',
    'difficultSubjectsIds',
  ])

  can(
    ['find', 'get'],
    'posts',
    ['_id', 'comment', 'type', 'startAt', 'duration', 'subjectId', '__v'],
    { startAt: { $gte: moment().utc().hours(0) } }
  )
  // can('find', ['subjects', 'years', 'departments'], ['_id', 'name'])

  // if (user) {
  //   can('find', 'posts', { creatorId: user._id })
  //   can('find', 'users', ['_id', 'email'])
  //   can('get', 'users')
  //   // can('patch', 'users')
  //   // can('patch', 'users')
  //   can('patch', 'users', ['lastName'], { _id: user._id })

  //   // can(['update', 'remove'], 'users', { _id: user._id })
  //   can(['find', 'get'], ['rooms', 'calendars'])
  // }
  // can('find', 'departments')
  // can(['get', 'find'], 'users')
  // if (user) {
  // }

  // can('find', 'years', ['_id', 'createdAt', 'updatedAt', '__v'])
  // can('find', 'posts', ['_id', 'comment', 'createdAt', 'updatedAt', '__v'])
  // can('get', 'posts', ['_id', 'comment', 'createdAt', 'updatedAt', '__v'])

  // can('create', 'years', ['name'])

  // // @ts-ignore
  // cannot('read', 'years').because('you cannot, be more powerful !')

  return new Ability<[Actions, Services]>(rules)
}
