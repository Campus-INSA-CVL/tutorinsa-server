import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { disallow } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.
import checkData from '../../hooks/check/check-data'

import checkDuplicate from '../../hooks/check/check-duplicate'

import checkIds from '../../hooks/check/check-ids'

import checkEmail from '../../hooks/check/check-user/check-email'

import checkPassword from '../../hooks/check/check-user/check-password'

import checkPermissions from '../../hooks/check/check-user/check-permissions'

// const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks

export default {
  before: {
    all: [],
    find: [],
    get: [],
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
    ],
    remove: [],
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
