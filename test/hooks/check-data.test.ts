import checkData from '../../src/hooks/check-data'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import { Year, User, Department, Subject } from '../../src/declarations'

describe("'check-data' hook", () => {
  it('noting should append without data', async () => {
    expect.assertions(2)
    let result: HookContext<any>
    let error: Error | null = null

    const context: HookContext<any> = {
      app: {} as Application,
      service: {} as Service<any>,
      method: 'create',
      params: {},
      path: '',
      type: 'before',
    }

    try {
      result = (await checkData()(context)) as HookContext<any>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  describe("'years'", () => {
    const serviceName = 'years'
    let context: HookContext<Year>

    let result: HookContext<Year>
    let error: Error | null

    beforeEach(() => {
      context = {
        app: {} as Application,
        service: {} as Service<Year>,
        method: 'create',
        params: {},
        path: serviceName,
        type: 'before',
      }

      result = null
      error = null
    })

    it('should request correct fields', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = {}

      try {
        result = (await checkData()(context)) as HookContext<Year>
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('request must contain correct fields')
    })

    it('shoud request correct data', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = { name: 1 }

      try {
        result = (await checkData()(context)) as HookContext<Year>
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('name must be a string')
    })

    it('should trim and sanitize data', async () => {
      expect.assertions(1)

      context.data = { name: '   8a/  ' }

      try {
        result = (await checkData()(context)) as HookContext<Year>
      } catch (e) {
        error = e
      }

      expect(result.data.name).toBe('8a&#x2F;')
    })
  })
  describe("'subjects'", () => {
    const serviceName = 'subjects'
    let context: HookContext<Subject>

    let result: HookContext<Subject>
    let error: Error | null

    beforeEach(() => {
      context = {
        app: {} as Application,
        service: {} as Service<Subject>,
        method: 'create',
        params: {},
        path: serviceName,
        type: 'before',
      }

      result = null
      error = null
    })
    it('should request correct fields', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = {}

      try {
        result = (await checkData()(context)) as HookContext<Subject>
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('request must contain correct fields')
    })

    it('shoud request correct data', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = { name: 1 }

      try {
        result = (await checkData()(context)) as HookContext<Subject>
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('name must be a string')
    })

    it('should trim and sanitize data', async () => {
      expect.assertions(1)

      context.data = { name: '   CC/  ' }

      try {
        result = (await checkData()(context)) as HookContext<Subject>
      } catch (e) {
        error = e
      }

      expect(result.data.name).toBe('CC&#x2F;')
    })
  })
  describe("'departments'", () => {
    const serviceName = 'departments'
    let context: HookContext<Department>

    let result: HookContext<Department>
    let error: Error | null

    beforeEach(() => {
      context = {
        app: {} as Application,
        service: {} as Service<Department>,
        method: 'create',
        params: {},
        path: serviceName,
        type: 'before',
      }

      result = null
      error = null
    })
    it('should request correct fields', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = {}

      try {
        result = (await checkData()(context)) as HookContext<Department>
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('request must contain correct fields')
    })

    it('shoud request correct data', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = { name: 1 }

      try {
        result = (await checkData()(context)) as HookContext<Department>
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('name must be a string')
    })

    it('should trim and sanitize data', async () => {
      expect.assertions(1)

      context.data = { name: '   sti/  ' }

      try {
        result = (await checkData()(context)) as HookContext<Department>
      } catch (e) {
        error = e
      }

      expect(result.data.name).toBe('sti&#x2F;')
    })
  })
  describe("'users'", () => {
    const serviceName = 'users'
    let context: HookContext<User>

    let result: HookContext<User>
    let error: Error | null

    describe('create', () => {
      const user: User = {
        lastName: 'LASTNAME',
        firstName: 'username',
        email: 'username@insa-cvl.fr',
        password: '$Azerty1',
        permissions: ['eleve'],
        yearId: 'data',
        departmentId: 'data',
        favoriteSubjectsIds: ['data'],
        difficultSubjectsIds: ['data'],
      }

      beforeEach(() => {
        context = {
          app: {} as Application,
          service: {} as Service<User>,
          method: 'create',
          params: {},
          path: serviceName,
          type: 'before',
        }

        result = null
        error = null
      })

      it.each(Object.keys(user))(
        'should request correct fields (%s is missing)',
        async (key) => {
          expect.assertions(2)

          const tmp: User = Object.assign({}, user)

          delete tmp[key]

          context.data = Object.assign({}, tmp)

          try {
            await checkData()(context)
          } catch (e) {
            error = e
          }

          expect(error).toBeInstanceOf(BadRequest)
          expect(error.message).toBe('some data are missing')
        }
      )

      it.each(Object.keys(user))(
        'shoud request correct data (typeof %s is wrong)',
        async (key) => {
          expect.assertions(2)

          const tmp: User = Object.assign({}, user)

          // @ts-ignore
          tmp[key] = 1

          context.data = Object.assign({}, tmp)

          try {
            await checkData()(context)
          } catch (e) {
            error = e
          }

          expect(error).toBeInstanceOf(BadRequest)
          expect(error.message).toBe(`type of '${key}' is incorrect`)
        }
      )

      it.each(Object.keys(user))(
        'should trim and sanitize the fied %s',
        async (key) => {
          expect.assertions(1)

          const tmp: User = Object.assign({}, user)

          if (typeof tmp[key] === 'string') {
            tmp[key] = tmp[key] + '/                  '
          } else if (Array.isArray(tmp[key])) {
            tmp[key] = [' data/ ']
          }

          context.data = Object.assign({}, tmp)

          try {
            result = (await checkData()(context)) as HookContext<User>
          } catch (e) {
            error = e
          }

          if (typeof tmp[key] === 'string') {
            expect(result.data[key]).toBe(`${user[key]}&#x2F;`)
          } else if (Array.isArray(tmp[key])) {
            expect(result.data[key]).not.toEqual(
              expect.arrayContaining([' data/ '])
            )
          }
        }
      )
    })

    describe('patch', () => {
      beforeEach(() => {
        context = {
          app: {} as Application,
          service: {} as Service<User>,
          method: 'patch',
          params: {},
          path: serviceName,
          type: 'before',
        }

        result = null
        error = null
      })

      it('should not throw an error if some data are missing', async () => {
        expect.assertions(2)

        try {
          result = (await checkData()(context)) as HookContext<User>
        } catch (e) {
          error = e
        }

        expect(error).toBeNull()
        expect(result).toEqual(context)
      })

      it.todo('should not throw an error if some fields are missing')
      it.todo('shoud request correct data')
      it.todo('should trim and sanitize the fieds')
    })
  })
})
