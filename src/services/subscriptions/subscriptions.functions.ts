import { Subscription, User, Post, Application } from '../../declarations'
import { Id } from '@feathersjs/feathers'
import { GeneralError } from '@feathersjs/errors'

/**
 * Create data to patch a user
 * @param {Subscription['as']} as
 * @param {Id} postId
 */
function createUserData(as: Subscription['as'], postId: Id): Partial<User> {
  let userData: Partial<User> = {}

  if (as === 'eleve') {
    userData = {
      studentSubscriptionsIds: [postId],
    }
  } else if (as === 'tuteur') {
    userData = {
      tutorSubscriptionsIds: [postId],
    }
  }

  return userData
}

/**
 * Create data to patch a post
 * @param {Subscription['as']} as
 * @param {Id} userId
 */
function createPostData(as: Subscription['as'], userId: Id): Partial<Post> {
  let postData: Partial<Post> = {}

  if (as === 'eleve') {
    postData = {
      studentsIds: [userId],
    }
  } else if (as === 'tuteur') {
    postData = {
      tutorsIds: [userId],
    }
  }

  return postData
}

/**
 * Patch a service
 * @param {Application} app
 * @param {'posts' | 'users'} service
 * @param {Id} id
 * @param {object} data
 * @param {object} params
 */
async function patchSubcription(
  app: Application,
  service: 'posts' | 'users',
  id: Id,
  data: object,
  params: object
) {
  try {
    await app.service(service).patch(id, data, params)
  } catch (e) {
    throw new GeneralError(`can't patch '${service}'`)
  }
}

export { createUserData, createPostData, patchSubcription }
