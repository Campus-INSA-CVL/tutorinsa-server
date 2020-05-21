import checkConcordanceDay from '../../../../src/hooks/check/check-post/check-concordance-day'

import { Room, Post } from '../../../../src/declarations'
import { HookContext, Service, Application } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'check-concordance-day' hook", () => {
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
      result = (await checkConcordanceDay()(context)) as HookContext<
        Post & { room: Room }
      >
    } catch (e) {
      error = e
    }

    expect(result).toEqual(context)
    expect(error).toBeNull()
  })

  it('nothing should happend without room', async () => {
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
      room: {
        day: 'mardi',
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

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(
      `day of post (${new Date(data.startAt).getUTCDay()}) and the room (${
        data.room.day
      }) must be the same`
    )
  })
})
