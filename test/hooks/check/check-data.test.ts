import checkData from '../../../src/hooks/check/check-data'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import { Options } from '../../../src/declarations'

describe("'check-data' hook", () => {
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
      result = (await checkData({} as Options)(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('should work with correct data', async () => {
    expect.assertions(2)

    const data = {
      string: 'data',
      array: ['data'],
      number: 42,
      date: '2020-05-17T15:46:29.581Z',
      password: 'azerty',
    }

    const options: Options = {
      fields: ['string', 'array', 'number', 'date', 'password'],
      arrayFields: ['array'],
      numberFields: ['number'],
      dateFields: ['date'],
      unwantedFields: ['password'],
    }

    context.data = Object.assign({}, data)

    try {
      result = (await checkData(options)(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it.each([
    ['string', 'data/     ', []],
    ['array', ['data/    '], []],
    ['unwanted', ['data/    '], ['unwanted']],
  ])(
    'should trim and sanitize data (%s)',
    async (key, value, unwantedFields) => {
      expect.assertions(2)

      const data = {}
      data[key] = value

      const options: Options = {
        fields: [key],
        arrayFields: ['array', 'unwanted'],
        unwantedFields,
      }

      context.data = Object.assign({}, data)

      try {
        result = (await checkData(options)(context)) as HookContext<any>
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      if (typeof data[key] === 'string' && !unwantedFields.includes(key)) {
        expect(result.data[key]).toBe(`data&#x2F;`)
      } else if (Array.isArray(data[key]) && !unwantedFields.includes(key)) {
        expect(result.data[key]).not.toEqual(
          expect.arrayContaining(value as string[])
        )
      } else if (unwantedFields.includes(key)) {
        expect(result.data[key]).toEqual(
          expect.arrayContaining(value as string[])
        )
      }
    }
  )

  it.each([
    [1, 'string', `type of 'field' is incorrect, must be a string`],
    ['data', 'array', `type of 'field' is incorrect, must be an array`],
    ['data', 'number', `type of 'field' is incorrect, must be a number`],
    ['data', 'date', `type of 'field' is incorrect, must be a date`],
  ])('should check type of fields', async (value, type, msg) => {
    expect.assertions(2)

    const data = {
      field: value,
    }

    let options: Options
    switch (type) {
      case 'string':
        options = {
          fields: ['field'],
        }
        break
      case 'array':
        options = {
          fields: ['field'],
          arrayFields: ['field'],
        }
        break
      case 'number':
        options = {
          fields: ['field'],
          numberFields: ['field'],
        }
        break
      case 'date':
        options = {
          fields: ['field'],
          dateFields: ['field'],
        }
        break
      default:
        break
    }

    context.data = Object.assign({}, data)

    try {
      result = (await checkData(options)(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(msg)
  })

  describe("'create' method", () => {
    it('should request missing fields', async () => {
      expect.assertions(2)

      const data = {}

      const options: Options = {
        fields: ['string'],
      }

      context.data = Object.assign({}, data)

      try {
        result = (await checkData(options)(context)) as HookContext<any>
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(`'string' is missing`)
    })
  })
})
