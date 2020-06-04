import * as authentication from '@feathersjs/authentication'
import { disallow } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.
import checkType from '../../hooks/check/check-post/check-type'
import { SubscriptionType, PostType } from '../../declarations'

import addPost from '../../hooks/add/add-post'

import checkIsPostFull from '../../hooks/check/check-subscription/check-is-post-full'

import checkIsUserAble from '../../hooks/check/check-subscription/check-is-user-able'

const { authenticate } = authentication.hooks

const typeOptions: SubscriptionType[] = ['subscribe', 'unsubscribe']
const asOptions: PostType[] = ['eleve', 'tuteur']

export default {
  before: {
    all: [],
    find: [disallow()],
    get: [disallow()],
    create: [disallow()],
    update: [disallow()],
    patch: [
      authenticate('jwt'),
      checkType('type', typeOptions),
      checkType('as', asOptions),
      checkIsUserAble(),
      addPost(),
      checkIsPostFull(),
    ],
    remove: [disallow()],
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
