import { AbilityBuilder, Ability } from '@casl/ability'
import { HookContext } from '@feathersjs/feathers'

import { User, ServiceTypes, UserPermission } from '../../declarations'
import moment from '../../utils/moment'

export type Actions = HookContext['method']
export type Services = keyof ServiceTypes
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
    [
      '_id',
      'comment',
      'type',
      'startAt',
      'duration',
      'subjectId',
      'subject',
      '__v',
    ],
    { startAt: { $gte: moment().utc().hours(0) } }
  )

  can(
    ['find', 'get'],
    'posts',
    [
      '_id',
      'comment',
      'type',
      'startAt',
      'duration',
      'subjectId',
      'subject',
      '__v',
    ],
    { type: 'eleve' }
  )

  if (user) {
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
    can('remove', 'users', { _id: user._id })

    can(
      'get',
      'posts',
      [
        '_id',
        'comment',
        'type',
        'startAt',
        'duration',
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
      ],
      {
        startAt: { $gte: moment().utc().hours(0) },
      }
    )

    can(
      'find',
      'posts',
      [
        '_id',
        'comment',
        'type',
        'startAt',
        'duration',
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
      ],
      {
        startAt: { $gte: moment().utc().hours(0) },
      }
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

    can(['find', 'get'], 'calendars', [
      '_id',
      'startAt',
      'duration',
      'roomId',
      'slots',
      'full',
      'room',
      '__v',
    ])

    can('patch', 'subscriptions')

    if (is('eleve', user)) {
      can('create', 'posts', ['comment', 'type', 'subjectId'], {
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
        '__v',
      ])
    }
  }

  return new Ability<[Actions, Services]>(rules)
}
