// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Subscription, Post } from '../../../declarations'
import { GeneralError, BadRequest } from '@feathersjs/errors'

export default (options = {}): Hook => {
  return async (context: HookContext<Subscription>) => {
    const { params, data } = context

    if (!params.post) {
      throw new GeneralError('a post is required to check if it is full')
    }

    if (data) {
      if (data.type === 'subscribe') {
        if (data.as === 'eleve' && (params.post as Post).fullStudents) {
          throw new BadRequest(
            "can't subscribe as student because this post is full"
          )
        } else if (data.as === 'tuteur' && (params.post as Post).fullTutors) {
          throw new BadRequest(
            "can't subscribe as tutor because this post is full"
          )
        }
      }
    }

    return context
  }
}
