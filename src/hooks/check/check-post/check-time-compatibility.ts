// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Post, Room } from '../../../declarations'
import { GeneralError, BadRequest } from '@feathersjs/errors'
import moment from '../../../utils/moment'

interface Time {
  startRoom: Date
  endRoom: Date
  startPost: Date
  endPost: Date
}

/**
 * Check that the endAt time is correct
 * @param {Time} time
 */
function checkEndTime(time: Time) {
  if (time.endPost.getUTCHours() > time.endRoom.getUTCHours()) {
    throw new BadRequest(
      `end time from post (${time.endPost}) is after end time from room (${time.endRoom})`
    )
  } else if (time.endPost.getUTCHours() === time.endRoom.getUTCHours()) {
    /* istanbul ignore else */
    if (time.endPost.getUTCMinutes() > time.endRoom.getUTCMinutes()) {
      throw new BadRequest(
        `end hour from post (${time.endPost}) is equal to end hour from room (${time.endRoom}) but start minutes from post is after end minutes from room`
      )
    }
  } else if (time.endPost.getUTCHours() < time.startRoom.getUTCHours()) {
    throw new BadRequest(
      `end time from post (${time.endPost}) is before start time from room (${time.startRoom})`
    )
  } else if (time.endPost.getUTCHours() === time.startRoom.getUTCHours()) {
    /* istanbul ignore else */
    if (time.endPost.getUTCMinutes() <= time.startRoom.getUTCMinutes()) {
      throw new BadRequest(
        `end hour from post (${time.endPost}) is equal to start hour from room (${time.startRoom}) but end minutes from post is before (or equal to) start minutes from room`
      )
    }
  } else {
    return
  }
}

/**
 * Check that the startAt time is correct
 * @param {Time} time
 */
function checkStartTime(time: Time) {
  if (time.startPost.getUTCHours() < time.startRoom.getUTCHours()) {
    throw new BadRequest(
      `start time from post (${time.startPost}) is before start time from room (${time.startRoom})`
    )
  } else if (time.startPost.getUTCHours() === time.startRoom.getUTCHours()) {
    /* istanbul ignore else */
    if (time.startPost.getUTCMinutes() < time.startRoom.getUTCMinutes()) {
      throw new BadRequest(
        `start hour from post (${time.startPost}) is equal to start hour from room (${time.startRoom}) but start minutes from post is before start minutes from room`
      )
    }
  } else if (time.startPost.getUTCHours() > time.endRoom.getUTCHours()) {
    throw new BadRequest(
      `start time from post (${time.startPost}) is after end time from room (${time.endRoom})`
    )
  } else if (time.startPost.getUTCHours() === time.endRoom.getUTCHours()) {
    /* istanbul ignore else */
    if (time.startPost.getUTCMinutes() >= time.endRoom.getUTCMinutes()) {
      throw new BadRequest(
        `start hour from post (${time.startPost}) is equal to end hour from room (${time.endRoom}) but start minutes from post is after (or equal to) end minutes from room`
      )
    }
  } else {
    return
  }
}

/**
 * Create a new date, adding duration to startAt
 * @param {string} startAt
 * @param {number} duration
 * @returns {string} The end date
 */
function endAt(startAt: string, duration: number): string {
  return moment(startAt).add(moment.duration(duration, 'minutes')).toISOString()
}

/**
 * Check that time from post and the room provided are compatible
 */
export default (options = {}): Hook => {
  return async (context: HookContext<Post & { room: Room }>) => {
    const { data, method } = context

    if (data) {
      switch (method) {
        case 'create':
          if (!data.room) {
            throw new GeneralError('no room provided to check calendars')
          }

          const time: Time = {
            startRoom: moment.utc(data.room.startAt).toDate(),
            endRoom: moment.utc(data.room.endAt as string).toDate(),
            startPost: moment.utc(data.startAt).toDate(),
            endPost: moment.utc(endAt(data.startAt!, data.duration!)).toDate(),
          }

          checkStartTime(time)

          checkEndTime(time)

          break
        /* istanbul ignore next */
        default:
          break
      }
    }
    return context
  }
}
