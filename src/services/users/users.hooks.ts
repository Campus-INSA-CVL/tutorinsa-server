import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { disallow } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.
import checkPermissions from '../../hooks/check-permissions'

import checkPassword from '../../hooks/check-password'

import checkData from '../../hooks/check-data'

import checkArray from '../../hooks/check-duplicate'
import checkDuplicate from '../../hooks/check-duplicate'

import checkEmail from '../../hooks/check-email'

import checkArrayContent from '../../hooks/check-array-content'

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
      checkArrayContent(),
      checkEmail(),
      checkPassword(),
      checkPermissions(),
      hashPassword('password'),
    ],
    update: [disallow()],
    patch: [
      checkData(),
      checkDuplicate(),
      checkArrayContent(),
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
