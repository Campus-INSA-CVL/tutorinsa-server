import checkTimeCompatibility from '../../../../src/hooks/check/check-post/check-time-compatibility'
import moment from '../../../../src/utils/moment'

import { Room, Post } from '../../../../src/declarations'
import { HookContext, Service, Application } from '@feathersjs/feathers'
import { BadRequest, GeneralError } from '@feathersjs/errors'

/**
 * Create a new date, adding duration to startAt
 * @param {string} startAt
 * @param {number} duration
 * @returns {string} The end date
 */
function endAt(startAt: string, duration: number): string {
  return moment(startAt).add(moment.duration(duration, 'minutes')).toISOString()
}

describe("'check-time-compatibility' hook", () => {
  describe("'create' method", () => {
    let context: HookContext<Post & { room: Room }>
    let result: HookContext<Post & { room: Room }>
    let error: Error | null

    beforeEach(async () => {
      context = {
        app: {} as Application,
        service: {} as Service<any>,
        method: 'create',
        params: {},
        path: '',
        type: 'before',
      }

      result = null
      error = null
    })

    it('nothing should happend without data', async () => {
      expect.assertions(2)

      try {
        result = (await checkTimeCompatibility()(context)) as HookContext<
          Post & { room: Room }
        >
      } catch (e) {
        error = e
      }

      expect(result).toEqual(context)
      expect(error).toBeNull()
    })

    it('should throw an error if a room is not provided', async () => {
      expect.assertions(2)

      const data: unknown = {
        key: 'value',
      }

      context.data = Object.assign({}, data) as Post & { room: Room }

      try {
        result = (await checkTimeCompatibility()(context)) as HookContext<
          Post & { room: Room }
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(GeneralError)
      expect(error.message).toBe('no room provided to check calendars')
    })

    it('should work with correct data', async () => {
      expect.assertions(2)

      const data: unknown = {
        room: {
          startAt: '2020-05-20T20:00:00.000Z',
          endAt: '2020-05-20T23:00:00.000Z',
        },
        startAt: '2020-05-20T20:30:00.000Z',
        duration: 120,
      }

      context.data = Object.assign({}, data) as Post & { room: Room }

      try {
        result = (await checkTimeCompatibility()(context)) as HookContext<
          Post & { room: Room }
        >
      } catch (e) {
        error = e
      }

      expect(result).toEqual(context)
      expect(error).toBeNull()
    })

    it.each([
      ['before', '2020-05-20T20:00:00.000Z', '2020-05-20T21:00:00.000Z'],
      ['equalBefore', '2020-05-20T20:00:00.000Z', '2020-05-20T20:30:00.000Z'],
    ])(
      'should throw an error if startAt Post is before startAt Room (%s)',
      async (type, startAtPost, startAtRoom) => {
        expect.assertions(2)

        const data: unknown = {
          room: {
            startAt: startAtRoom,
            endAt: '',
          },
          startAt: startAtPost,
        }

        context.data = Object.assign({}, data) as Post & { room: Room }

        try {
          result = (await checkTimeCompatibility()(context)) as HookContext<
            Post & { room: Room }
          >
        } catch (e) {
          error = e
        }

        expect(error).toBeInstanceOf(BadRequest)
        if (type === 'before') {
          expect(error.message).toBe(
            `start time from post (${new Date(
              startAtPost
            )}) is before start time from room (${new Date(startAtRoom)})`
          )
        } else if (type === 'equalBefore') {
          expect(error.message).toBe(
            `start hour from post (${new Date(
              startAtPost
            )}) is equal to start hour from room (${new Date(
              startAtRoom
            )}) but start minutes from post is before start minutes from room`
          )
        }
      }
    )

    it.each([
      [
        'after',
        '2020-05-20T23:00:00.000Z',
        30,
        '2020-05-20T21:00:00.000Z',
        '2020-05-20T22:00:00.000Z',
      ],
      [
        'equalAfter',
        '2020-05-20T23:00:00.000Z',
        30,
        '2020-05-20T21:00:00.000Z',
        '2020-05-20T23:00:00.000Z',
      ],
      [
        'supAfter',
        '2020-05-20T23:30:00.000Z',
        0,
        '2020-05-20T21:00:00.000Z',
        '2020-05-20T23:00:00.000Z',
      ],
    ])(
      'should throw an error if startAt Post is after endAt Room (%s)',
      async (type, startAtPost, duration, startAtRoom, endAtRoom) => {
        expect.assertions(2)

        const data: unknown = {
          room: {
            startAt: startAtRoom,
            endAt: endAtRoom,
          },
          startAt: startAtPost,
          duration,
        }

        context.data = Object.assign({}, data) as Post & { room: Room }

        try {
          result = (await checkTimeCompatibility()(context)) as HookContext<
            Post & { room: Room }
          >
        } catch (e) {
          error = e
        }

        expect(error).toBeInstanceOf(BadRequest)
        if (type === 'after') {
          expect(error.message).toBe(
            `start time from post (${new Date(
              startAtPost
            )}) is after end time from room (${new Date(endAtRoom)})`
          )
        } else if (type === 'equalAfter' || type === 'supAfter') {
          expect(error.message).toBe(
            `start hour from post (${new Date(
              startAtPost
            )}) is equal to end hour from room (${new Date(
              endAtRoom
            )}) but start minutes from post is after (or equal to) end minutes from room`
          )
        }
      }
    )

    it.each([
      [
        'after',
        '2020-05-20T21:00:00.000Z',
        120,
        '2020-05-20T21:00:00.000Z',
        '2020-05-20T22:00:00.000Z',
      ],
      [
        'equalAfter',
        '2020-05-20T21:00:00.000Z',
        150,
        '2020-05-20T21:00:00.000Z',
        '2020-05-20T23:00:00.000Z',
      ],
    ])(
      'should throw an error if endAt Post is after endAt Room (%s)',
      async (type, startAtPost, duration, startAtRoom, endAtRoom) => {
        expect.assertions(2)

        const data: unknown = {
          room: {
            startAt: startAtRoom,
            endAt: endAtRoom,
          },
          startAt: startAtPost,
          duration,
        }

        context.data = Object.assign({}, data) as Post & { room: Room }

        try {
          result = (await checkTimeCompatibility()(context)) as HookContext<
            Post & { room: Room }
          >
        } catch (e) {
          error = e
        }

        expect(error).toBeInstanceOf(BadRequest)
        if (type === 'after') {
          expect(error.message).toBe(
            `end time from post (${new Date(
              endAt(startAtPost, duration)
            )}) is after end time from room (${new Date(endAtRoom)})`
          )
        } else if (type === 'equalAfter' || type === 'supAfter') {
          expect(error.message).toBe(
            `end hour from post (${new Date(
              endAt(startAtPost, duration)
            )}) is equal to end hour from room (${new Date(
              endAtRoom
            )}) but start minutes from post is after end minutes from room`
          )
        }
      }
    )

    it.each([
      [
        'before',
        '2020-05-20T22:00:00.000Z',
        -30,
        '2020-05-20T22:00:00.000Z',
        '2020-05-20T23:00:00.000Z',
      ],
      [
        'equalBefore',
        '2020-05-20T21:30:00.000Z',
        -30,
        '2020-05-20T21:00:00.000Z',
        '2020-05-20T23:00:00.000Z',
      ],
      [
        'supBefore',
        '2020-05-20T21:30:00.000Z',
        -30,
        '2020-05-20T21:30:00.000Z',
        '2020-05-20T23:00:00.000Z',
      ],
    ])(
      'should throw an error if endAt Post is before startAt Room (%s)',
      async (type, startAtPost, duration, startAtRoom, endAtRoom) => {
        expect.assertions(2)

        const data: unknown = {
          room: {
            startAt: startAtRoom,
            endAt: endAtRoom,
          },
          startAt: startAtPost,
          duration,
        }

        context.data = Object.assign({}, data) as Post & { room: Room }

        try {
          result = (await checkTimeCompatibility()(context)) as HookContext<
            Post & { room: Room }
          >
        } catch (e) {
          error = e
        }

        expect(error).toBeInstanceOf(BadRequest)
        if (type === 'before') {
          expect(error.message).toBe(
            `end time from post (${new Date(
              endAt(startAtPost, duration)
            )}) is before start time from room (${new Date(startAtRoom)})`
          )
        } else if (type === 'equalBefore' || type === 'supBefore') {
          expect(error.message).toBe(
            `end hour from post (${new Date(
              endAt(startAtPost, duration)
            )}) is equal to start hour from room (${new Date(
              startAtRoom
            )}) but end minutes from post is before (or equal to) start minutes from room`
          )
        }
      }
    )
  })
})
