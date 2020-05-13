import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { disallow } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.
import checkPermissions from '../../hooks/check/check-user/check-permissions'

import checkPassword from '../../hooks/check/check-user/check-password'

import checkData from '../../hooks/check/check-data'

import checkDuplicate from '../../hooks/check/check-duplicate'

import checkEmail from '../../hooks/check/check-user/check-email'

import checkIds from '../../hooks/check/check-ids'

const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      checkData(),
      checkDuplicate(),
      checkIds(),
      checkEmail(),
      checkPassword(),
      checkPermissions(),
      hashPassword('password'),
    ],
    update: [disallow()],
    patch: [
      checkData(),
      checkDuplicate(),
      checkIds(),
      checkEmail(),
      checkPassword(),
      checkPermissions(),
      hashPassword('password'),
      authenticate('jwt'),
    ],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
