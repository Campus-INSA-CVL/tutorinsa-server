// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post, PostType } from '../../../declarations'
import { BadRequest } from '@feathersjs/errors'

export default (options = {}): Hook => {
  return async (context: HookContext<Post>) => {
    const { data } = context

    const types: PostType[] = ['eleve', 'tuteur']

    if (data?.type) {
      if (!types.includes(data.type)) {
        throw new BadRequest(`${data.type} is an incorrect type of post`)
      }
    }

    return context
  }
}
