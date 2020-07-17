import checkAction from '../../hooks/check/check-auth-management/check-action'
import { Action } from '../../declarations'
import { iff, isProvider } from 'feathers-hooks-common'

const authorizedActions: Action[] = [
  'resendVerifySignup',
  'verifySignupLong',
  'sendResetPwd',
  'resetPwdLong',
  'passwordChange',
  'options',
]

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [iff(isProvider('external')), checkAction(authorizedActions)],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
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
