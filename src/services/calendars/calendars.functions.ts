import { Calendar, Slot } from '../../declarations'
import { Id } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import moment from '../../utils/moment'

/**
 * Create slots, 30 minutes per slot
 * @param start - the beginning of the post
 * @param duration - total time of this calendar
 * @param postId - the post associated to this calendar
 * @returns slots
 */
function createSlots(start: string, duration: number, postId: Id = ''): Slot[] {
  const slots: Slot[] = []

  const split = duration / 30

  for (let index = 0; index < split; index++) {
    const startAt = new Date(start)
    // Full hour
    if (index % 2 === 0) {
      startAt.setHours(startAt.getHours() + index / 2)
      // Half hour
    } else {
      startAt.setHours(startAt.getHours() + (index - 1) / 2)
      startAt.setMinutes(startAt.getMinutes() + 30)
    }
    // Add the slot
    slots.push({
      postId,
      startAt: startAt.toISOString(),
      occupied: true,
    })
  }

  return slots
}

/**
 * Create a new date using post and room because date room is a 1970's date
 * @param {string} startAtPost
 * @param {string} startAtRoom
 * @returns {string} The new date
 */
function createConcatDate(startAtPost: string, startAtRoom: string): string {
  const startAt = new Date(0)

  // DD/MM/YYYY from post
  startAt.setUTCFullYear(new Date(startAtPost).getUTCFullYear())
  startAt.setUTCDate(new Date(startAtPost).getUTCDate())
  startAt.setUTCMonth(new Date(startAtPost).getUTCMonth())

  // HH/mm from room
  startAt.setUTCHours(new Date(startAtRoom).getUTCHours())
  startAt.setUTCMinutes(new Date(startAtRoom).getUTCMinutes())

  return startAt.toISOString()
}

/**
 * Create a 1970 date with hours and minutes from the date
 * @param date
 * @returns string
 */
function createUTCTime(date: string): string {
  if (!moment(date).isValid()) {
    throw new Error(`'${date}' is not a valide date`)
  }

  const newDate = new Date(0)
  newDate.setHours(new Date(date).getUTCHours())
  newDate.setMinutes(new Date(date).getMinutes())

  return newDate.toISOString()
}

export { createSlots, createUTCTime, createConcatDate }
