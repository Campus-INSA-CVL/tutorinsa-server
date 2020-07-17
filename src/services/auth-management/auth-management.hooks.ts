import checkAction from '../../hooks/check/check-auth-management/check-action'
import { Action } from '../../declarations'

const authorizedActions: Action[] = [
  'resendVerifySignup',
  'verifySignupLong',
  'sendResetPwd',
  'resetPwdLong',
  'passwordChange',
]

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [checkAction(authorizedActions)],
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
