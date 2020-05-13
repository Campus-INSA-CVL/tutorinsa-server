// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Room } from '../../../declarations'

export default (options = {}): Hook => {
  return async (context: HookContext<Room>) => {
    return context
  }
}
