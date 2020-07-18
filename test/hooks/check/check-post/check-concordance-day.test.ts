import checkConcordanceDay from '../../../../src/hooks/check/check-post/check-concordance-day'
import moment from '../../../../src/utils/moment'

import { Room, Post } from '../../../../src/declarations'
import { HookContext, Service, Application } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'check-concordance-day' hook", () => {
  let context: HookContext<Post>
  let result: HookContext<Post>
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

  it('nothing should happens without data', async () => {
    expect.assertions(2)

    try {
      result = (await checkConcordanceDay()(context)) as HookContext<
        Post & { room: Room }
      >
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })

  it('nothing should happens without room in params', async () => {
    expect.assertions(2)

    const data = {
      key: 'value',
    }

    context.data = Object.assign({})

    try {
      result = (await checkConcordanceDay()(context)) as HookContext<
        Post & { room: Room }
      >
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })

  it.each(['data', 'params'])(
    'nothing should happens without startAt in %s',
    async (value) => {
      expect.assertions(2)

      const room = {
        day: 'lundi',
      }
      const post = {
        key: 'not a date',
      }

      if (value === 'data') {
        context.params = Object.assign({}, { room })
        // @ts-ignore
        context.data = Object.assign({}, post)
      } else if (value === 'params') {
        context.params = Object.assign({}, { room }, { post })
      }

      try {
        result = (await checkConcordanceDay()(context)) as HookContext<
          Post & { room: Room }
        >
      } catch (e) {
        error = e
      }

      expect(result).toEqual(context)
      expect(error).toBeNull()
    }
  )
  it('should work with correct data', async () => {
    expect.assertions(2)

    const data = {
      startAt: 'Mon May 18 2020 11:08:20 GMT+0200',
      room: {
        day: 'lundi',
      },
    }

    context.data = Object.assign({}, data) as Post & { room: Room }

    try {
      result = (await checkConcordanceDay()(context)) as HookContext<
        Post & { room: Room }
      >
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })
  it("should throw an error if days doesn't match", async () => {
    expect.assertions(2)

    const data = {
      startAt: 'Mon May 18 2020 11:08:20 GMT+0200',
    }

    const params = {
      room: {
        day: 'mardi',
      },
    }

    context.data = Object.assign({}, data) as Post
    context.params = Object.assign({}, params)

    try {
      result = (await checkConcordanceDay()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(
      `day of post (${
        moment.weekdays()[new Date(data.startAt).getUTCDay()]
      }) and the room (${params.room.day}) must be the same`
    )
  })
})
