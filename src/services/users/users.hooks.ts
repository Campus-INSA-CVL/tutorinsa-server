import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { disallow } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.
import checkPermissions from '../../hooks/check-permissions'

import checkPassword from '../../hooks/check-password'

import checkData from '../../hooks/check-data'

import checkArray from '../../hooks/check-duplicate'
import checkDuplicate from '../../hooks/check-duplicate'

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
      checkPassword(),
      hashPassword('password'),
      checkPermissions(),
    ],
    update: [disallow()],
    patch: [
      checkData(),
      checkDuplicate(),
      checkPassword(),
      hashPassword('password'),
      authenticate('jwt'),
      checkPermissions(),
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
