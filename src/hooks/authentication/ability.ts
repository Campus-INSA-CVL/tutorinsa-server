import { AbilityBuilder, Ability } from '@casl/ability'
import { HookContext } from '@feathersjs/feathers'

import { User, ServiceTypes, UserPermission } from '../../declarations'

export type Actions = HookContext['method']
export type Services = Exclude<keyof ServiceTypes, 'mailer'>
type AppAbility = Ability<[Actions, Services]>

/**
 * Check if a user have a role
 * @param {UserPermission} role
 * @param {User} user
 * @returns {boolean}
 */
function is(role: UserPermission, user: User): boolean {
  return user.permissions.includes(role)
}

/**
 * Create ability to manage access to ressources
 * @param {User} user
 * @returns {Ability} ability
 */
export default function defineAbilitiesFor(user: User): Ability {
  const { rules, can } = new AbilityBuilder<AppAbility>()

  can('create', 'authManagement', ['action', 'value'])

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

  can(['find', 'get'], 'posts', [
    '_id',
    'comment',
    'type',
    'startAt',
    'duration',
    'campus',
    'subjectId',
    'roomId',
    'subject',
    'room',
    'createdAt',
    'endAt',
    '__v',
  ])

  can('find', 'rooms', ['_id', 'campus', '__v'])

  if (user) {
    can('create', 'subscriptions-notifications')

    can('find', 'users', [
      '_id',
      'lastName',
      'firstName',
      'email',
      'yearId',
      'departmentId',
      'favoriteSubjectsIds',
      'difficultSubjectsIds',
      'createdPostsIds',
      'year',
      'department',
      'favoriteSubjects',
      'difficultSubjects',
      '__v',
    ])

    can('get', 'users', { _id: user._id })
    can(
      'patch',
      'users',
      [
        'lastName',
        'firstName',
        'yearId',
        'departmentId',
        'favoriteSubjectsIds',
        'difficultSubjectsIds',
        'permissions',
        'appTheme',
      ],
      { _id: user._id }
    )
    can('remove', 'users', { _id: user._id })

    can('get', 'posts', [
      '_id',
      'comment',
      'type',
      'startAt',
      'duration',
      'campus',
      'studentsCapacity',
      'tutorsCapacity',
      'subjectId',
      'studentsIds',
      'tutorsIds',
      'roomId',
      'creatorId',
      'endAt',
      'fullStudents',
      'fullTutors',
      'createdAt',
      'updatedAt',
      'subject',
      'room',
      'creator',
      'students',
      'tutors',
      '__v',
    ])

    can('find', 'posts', [
      '_id',
      'comment',
      'type',
      'startAt',
      'duration',
      'campus',
      'studentsCapacity',
      'tutorsCapacity',
      'subjectId',
      'studentsIds',
      'tutorsIds',
      'roomId',
      'creatorId',
      'endAt',
      'fullStudents',
      'fullTutors',
      'createdAt',
      'updatedAt',
      'subject',
      'room',
      'creator',
      'students',
      'tutors',
      '__v',
    ])
    can(
      'patch',
      'posts',
      [
        'comment',
        'startAt',
        'duration',
        'campus',
        'studentsCapacity',
        'tutorsCapacity',
        'subjectId',
        'roomId',
      ],
      { creatorId: user._id }
    )
    can('remove', 'posts', { creatorId: user._id })

    can(['find', 'get'], 'rooms', [
      '_id',
      'campus',
      'name',
      'day',
      'startAt',
      'duration',
      'endAt',
      '__v',
    ])

    can(['patch'], 'subscriptions', ['as', 'type'])

    if (is('eleve', user)) {
      can('create', 'posts', ['comment', 'type', 'subjectId', 'campus'], {
        type: 'eleve',
      })
    }

    if (is('tuteur', user)) {
      can(
        'create',
        'posts',
        [
          'comment',
          'type',
          'startAt',
          'duration',
          'studentsCapacity',
          'tutorsCapacity',
          'subjectId',
          'roomId',
        ],
        {
          type: 'tuteur',
        }
      )
    }

    if (is('admin', user)) {
      can('create', 'push')
      can('create', 'notifications')

      can(['create', 'patch'], ['subjects', 'years', 'departments'])
      can('find', 'posts', [
        '_id',
        'comment',
        'type',
        'startAt',
        'duration',
        'campus',
        'studentsCapacity',
        'tutorsCapacity',
        'subjectId',
        'studentsIds',
        'tutorsIds',
        'roomId',
        'creatorId',
        'endAt',
        'fullStudents',
        'fullTutors',
        'createdAt',
        'updatedAt',
        'subject',
        'room',
        'creator',
        'students',
        'tutors',
        '__v',
      ])
      can('get', 'posts', [
        '_id',
        'comment',
        'type',
        'startAt',
        'duration',
        'campus',
        'studentsCapacity',
        'tutorsCapacity',
        'subjectId',
        'studentsIds',
        'tutorsIds',
        'roomId',
        'creatorId',
        'endAt',
        'fullStudents',
        'fullTutors',
        'createdAt',
        'updatedAt',
        'subject',
        'room',
        'creator',
        'students',
        'tutors',
        '__v',
      ])
      can(
        'create',
        'posts',
        [
          'comment',
          'type',
          'startAt',
          'duration',
          'campus',
          'studentsCapacity',
          'tutorsCapacity',
          'subjectId',
          'roomId',
        ],
        {
          type: { $in: ['eleve', 'tuteur'] },
        }
      )
      can('remove', 'posts')

      can('create', 'rooms')

      can('find', 'users', [
        '_id',
        'lastName',
        'firstName',
        'email',
        'yearId',
        'departmentId',
        'favoriteSubjectsIds',
        'difficultSubjectsIds',
        'createdPostsIds',
        'studentSubscriptionsIds',
        'tutorSubscriptionsIds',
        'year',
        'department',
        'favoriteSubjects',
        'difficultSubjects',
        'appTheme',
        '__v',
      ])
      can(['patch', 'remove'], 'users')
    }
  }

  return new Ability<[Actions, Services]>(rules)
}
