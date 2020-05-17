import normalizeDate from '../../src/hooks/normalize-date'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'normalize-date' hook", () => {
  let context: HookContext<any>

  let result: HookContext<any>
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

  it('nothing should append without data', async () => {
    expect.assertions(2)
    try {
      result = (await normalizeDate()(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should work with correct data', async () => {
    expect.assertions(2)
    const data = {
      dateField: 'Sun May 17 2020 17:43:31 GMT+0200',
    }

    context.data = Object.assign({}, data)

    try {
      result = (await normalizeDate(['dateField'])(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result.data.dateField).toEqual(
      new Date(data.dateField).toISOString()
    )
  })

  it('should throw an error if the date is not correct', async () => {
    expect.assertions(2)
    const data = {
      dateField: 'some data',
    }

    context.data = Object.assign({}, data)

    try {
      result = (await normalizeDate(['dateField'])(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(`'${data.dateField}' is not a valid date`)
  })
})
