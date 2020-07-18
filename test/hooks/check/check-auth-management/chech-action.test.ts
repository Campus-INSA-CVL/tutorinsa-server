import { HookContext, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import checkAction from '../../../../src/hooks/check/check-auth-management/check-action'
import { Action, Application } from '../../../../src/declarations'

describe("'check-user-is-verified' hook", () => {
  let context: HookContext
  let result: HookContext
  let error: Error | null

  beforeEach(() => {
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

  it('nothing should happens without action', async () => {
    try {
      result = (await checkAction([])(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('nothing should happens with correct action', async () => {
    const authorizedActions: Action[] = ['passwordChange']
    context.data = { action: authorizedActions[0] }
    try {
      result = (await checkAction(authorizedActions)(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should throw an error if action is not authorized', async () => {
    const authorizedActions: Action[] = ['passwordChange']
    context.data = { action: authorizedActions[0] }
    try {
      result = (await checkAction([])(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(
      `'${context.data.action}' is not an authorized action`
    )
  })
})
