import allowSubscription from '../../../src/hooks/subscription/allow-subscription'
import { Application, Subscription, Post } from '../../../src/declarations'
import { Service, HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'allowSubscription' hook", () => {
  let context: HookContext<Subscription>

  let result: HookContext<Subscription>
  let error: Error | null

  beforeEach(async () => {
    context = {
      app: {} as Application,
      service: {} as Service<Subscription>,
      method: 'create',
      params: {},
      path: '',
      type: 'before',
    }

    result = null
    error = null
  })

  it('should thow an error if type of post is not the good', async () => {
    const params = {
      post: {
        type: 'eleve',
      },
    }

    context.params = params

    try {
      await allowSubscription('tuteur')(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(
      `you can't subscribe to this type of post: '${
        (params.post as Post).type
      }'`
    )
  })

  it('should work', async () => {
    const params = {
      post: {
        type: 'tuteur',
      },
    }

    context.params = params

    try {
      await allowSubscription('tuteur')(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
  })
})
