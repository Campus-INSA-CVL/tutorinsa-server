import { Application, Service, HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

import loggerHook from '../../src/hooks/logger'

jest.mock('../../src/logger')
import logger from '../../src/logger'

describe("'logger' hook", () => {
  it('should log before', async () => {
    const context: HookContext = {
      app: {} as Application,
      service: {} as Service<any>,
      method: 'create',
      params: {},
      path: 'users',
      type: 'before',
    }
    await loggerHook()(context)

    expect(logger.info).toHaveBeenCalledWith(
      `${context.method} ${context.path}`
    )
    expect(logger.debug).toHaveBeenCalled()
  })

  it('should log after', async () => {
    const context: HookContext = {
      app: {} as Application,
      service: {} as Service<any>,
      method: 'create',
      params: {},
      path: 'users',
      type: 'after',
    }
    await loggerHook()(context)

    expect(logger.info).toHaveBeenCalledWith(
      `${context.method} ${context.path}`
    )
    expect(logger.debug).toHaveBeenCalled()
  })
  it('should log error', async () => {
    const context: HookContext = {
      app: {} as Application,
      service: {} as Service<any>,
      method: 'create',
      params: {},
      path: 'users',
      type: 'before',
      error: new BadRequest('error !'),
    }
    await loggerHook()(context)

    expect(logger.info).toHaveBeenCalledWith(
      `${context.method} ${context.path}`
    )
    expect(logger.error).toHaveBeenCalled()
  })
})
