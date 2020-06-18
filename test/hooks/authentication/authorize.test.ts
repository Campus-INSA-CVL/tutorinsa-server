import authorize from '../../../src/hooks/authentication/authorize'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'

describe("'authorize' hook", () => {
  let result: HookContext
  let context: HookContext
  let error: Error | null

  beforeEach(() => {
    context = {
      app: {} as Application,
      service: {} as Service<any>,
      // @ts-ignore
      method: 'data',
      params: {},
      path: 'years',
      type: 'before',
      result: {},
    }

    error = null
  })

  it("should throw an error if a user can't access to a ressource", async () => {
    try {
      await authorize()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(Forbidden)
    expect(error.message).toBe(
      `You are not allowed to ${context.method} on ${context.path}`
    )
  })

  it('should access to a ressource', async () => {
    // @ts-ignore
    context.method = 'find'

    try {
      result = (await authorize()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
})
