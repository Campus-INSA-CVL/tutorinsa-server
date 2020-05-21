// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Application, Id } from '@feathersjs/feathers'
import { Room } from '../declarations'
import { GeneralError } from '@feathersjs/errors'

/**
 * Get the room using the roomId
 * @param {Application} app
 * @param {any} data
 * @returns The room
 */
async function getRoom(app: Application, roomId: Id): Promise<Room> {
  let room: Room
  try {
    room = (await app.service('rooms').get(roomId)) as Room
  } catch (error) {
    throw new GeneralError('impossible to add a room to data')
  }
  return room
}

/**
 * Add a room to the data using the room id
 */
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, data } = context

    if (data?.roomId) {
      context.data.room = await getRoom(app, data.roomId)
    }
    return context
  }
}
