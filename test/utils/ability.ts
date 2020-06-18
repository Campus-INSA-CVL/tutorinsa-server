import { defineAbility } from '@casl/ability'

export default defineAbility((can) => {
  can(['find', 'get'], 'posts', [
    '_id',
    'comment',
    'type',
    'startAt',
    'duration',
    'subjectId',
    'subject',
    '__v',
  ])
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
})
