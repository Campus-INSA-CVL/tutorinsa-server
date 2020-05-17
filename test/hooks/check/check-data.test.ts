import checkData from '../../../src/hooks/check/check-data'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'
import {
  Year,
  User,
  Department,
  Subject,
  Room,
  Options,
} from '../../../src/declarations'
import moment from '../../../src/utils/moment'

describe("'check-data' hook", () => {
  it('nothing should append without data', async () => {
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
      result = (await checkData({} as Options)(context)) as HookContext<any>
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
    const year: Year = {
      name: '2a',
    }

    const checkDataOptions: Options = {
      fields: ['name'],
    }

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

    it('nothing should append with correct data', async () => {
      expect.assertions(2)

      context.data = Object.assign({}, year)

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Year
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result).toEqual(context)
    })

    it('should request correct fields', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = {}

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Year
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(`'name' is missing`)
    })

    it('shoud request correct data', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = { name: 1 }

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Year
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(
        "type of 'name' is incorrect, must be a string"
      )
    })

    it('should trim and sanitize data', async () => {
      expect.assertions(1)

      context.data = { name: '   8a/  ' }

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Year
        >
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
    const subject: Subject = {
      name: 'CC',
    }

    const checkDataOptions: Options = {
      fields: ['name'],
    }

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

    it('nothing should append with correct data', async () => {
      expect.assertions(2)

      context.data = Object.assign({}, subject)

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Subject
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result).toEqual(context)
    })

    it('should request correct fields', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = {}

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Subject
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(`'name' is missing`)
    })

    it('shoud request correct data', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = { name: 1 }

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Subject
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(
        "type of 'name' is incorrect, must be a string"
      )
    })

    it('should trim and sanitize data', async () => {
      expect.assertions(1)

      context.data = { name: '   CC/  ' }

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Subject
        >
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
    const department: Department = {
      name: 'STI',
    }

    const checkDataOptions: Options = {
      fields: ['name'],
    }

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

    it('nothing should append with correct data', async () => {
      expect.assertions(2)

      context.data = Object.assign({}, department)

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Department
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result).toEqual(context)
    })

    it('should request correct fields', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = {}

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Department
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(`'name' is missing`)
    })

    it('shoud request correct data', async () => {
      expect.assertions(2)

      // @ts-ignore
      context.data = { name: 1 }

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Department
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(
        "type of 'name' is incorrect, must be a string"
      )
    })

    it('should trim and sanitize data', async () => {
      expect.assertions(1)

      context.data = { name: '   sti/  ' }

      try {
        result = (await checkData(checkDataOptions)(context)) as HookContext<
          Department
        >
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

    const checkDataOptions: Options = {
      fields: [
        'lastName',
        'firstName',
        'email',
        'password',
        'permissions',
        'yearId',
        'departmentId',
        'favoriteSubjectsIds',
        'difficultSubjectsIds',
      ],
      arrayFields: [
        'permissions',
        'favoriteSubjectsIds',
        'difficultSubjectsIds',
      ],
      unwantedFields: ['password', 'email'],
    }

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

      it('nothing should append with correct data', async () => {
        expect.assertions(2)

        context.data = Object.assign({}, user)

        try {
          result = (await checkData(checkDataOptions)(context)) as HookContext<
            User
          >
        } catch (e) {
          error = e
        }

        expect(error).toBeNull()
        expect(result).toEqual(context)
      })

      it.each(Object.keys(user))(
        'should request correct fields (%s is missing)',
        async (key) => {
          expect.assertions(2)

          const tmp: User = Object.assign({}, user)

          delete tmp[key]

          context.data = Object.assign({}, tmp)

          try {
            await checkData(checkDataOptions)(context)
          } catch (e) {
            error = e
          }

          expect(error).toBeInstanceOf(BadRequest)
          expect(error.message).toBe(`'${key}' is missing`)
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
            await checkData(checkDataOptions)(context)
          } catch (e) {
            error = e
          }

          expect(error).toBeInstanceOf(BadRequest)
          if (typeof user[key] === 'string') {
            expect(error.message).toBe(
              `type of '${key}' is incorrect, must be a string`
            )
          } else {
            expect(error.message).toBe(
              `type of '${key}' is incorrect, must be an array`
            )
          }
        }
      )

      it.each(Object.keys(user))(
        'should trim and sanitize the fied %s',
        async (key) => {
          if (key !== 'password' && key !== 'email') {
            expect.assertions(1)
          } else {
            expect.assertions(0)
          }

          const tmp: User = Object.assign({}, user)

          if (typeof tmp[key] === 'string') {
            tmp[key] = tmp[key] + '/                  '
          } else if (Array.isArray(tmp[key])) {
            tmp[key] = [' data/ ']
          }

          context.data = Object.assign({}, tmp)

          try {
            result = (await checkData(checkDataOptions)(
              context
            )) as HookContext<User>
          } catch (e) {
            error = e
          }

          if (
            typeof tmp[key] === 'string' &&
            key !== 'password' &&
            key !== 'email'
          ) {
            expect(result.data[key]).toBe(`${user[key]}&#x2F;`)
          } else if (Array.isArray(tmp[key])) {
            expect(result.data[key]).not.toEqual(
              expect.arrayContaining([' data/ '])
            )
          }
        }
      )

      it('should not trim and sanitize the email field', async () => {
        expect.assertions(1)

        const tmp: User = Object.assign({}, user)

        tmp.email = tmp.email + '/'
        context.data = Object.assign({}, tmp)

        try {
          result = (await checkData(checkDataOptions)(context)) as HookContext<
            User
          >
        } catch (e) {
          error = e
        }

        expect(result.data.email).toBe(user.email + '/')
      })

      it('should not trim and sanitize the password field', async () => {
        expect.assertions(1)

        const tmp: User = Object.assign({}, user)

        tmp.password = tmp.password + '/'
        context.data = Object.assign({}, tmp)

        try {
          result = (await checkData(checkDataOptions)(context)) as HookContext<
            User
          >
        } catch (e) {
          error = e
        }

        expect(result.data.password).toBe(user.password + '/')
      })
    })

    describe('patch', () => {
      // Remove some fields because of patch
      const user = {
        lastName: 'LASTNAME',
        password: '$Azerty1',
        permissions: ['eleve'],
        departmentId: 'data',
        favoriteSubjectsIds: ['data'],
      }

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
          result = (await checkData(checkDataOptions)(context)) as HookContext<
            User
          >
        } catch (e) {
          error = e
        }

        expect(error).toBeNull()
        expect(result).toEqual(context)
      })

      it.each([
        ['lastName', 1, "type of 'lastName' is incorrect, must be a string"],
        [
          'permissions',
          'data',
          "type of 'permissions' is incorrect, must be an array",
        ],
        [
          'favoriteSubjectsIds',
          'data',
          "type of 'favoriteSubjectsIds' is incorrect, must be an array",
        ],
      ])('shoud request correct data for %s', async (key, value, expected) => {
        expect.assertions(1)

        const data = {}
        data[key] = value

        context.data = data as User

        try {
          await checkData(checkDataOptions)(context)
        } catch (e) {
          error = e
        }

        expect(error.message).toBe(expected)
      })

      it.each(Object.keys(user))(
        'should trim and sanitize the fied %s',
        async (key) => {
          if (key !== 'password' && key !== 'email') {
            expect.assertions(1)
          } else {
            expect.assertions(0)
          }

          const tmp: User = Object.assign({}, user) as User

          if (typeof tmp[key] === 'string') {
            tmp[key] = tmp[key] + '/                  '
          } else if (Array.isArray(tmp[key])) {
            tmp[key] = [' data/ ']
          }

          context.data = Object.assign({}, tmp)

          try {
            result = (await checkData(checkDataOptions)(
              context
            )) as HookContext<User>
          } catch (e) {
            error = e
          }

          if (
            typeof tmp[key] === 'string' &&
            key !== 'password' &&
            key !== 'email'
          ) {
            expect(result.data[key]).toBe(`${user[key]}&#x2F;`)
          } else if (Array.isArray(tmp[key])) {
            expect(result.data[key]).not.toEqual(
              expect.arrayContaining([' data/ '])
            )
          }
        }
      )
    })
  })

  describe("'rooms'", () => {
    const serviceName = 'rooms'
    let context: HookContext<Room>
    let result: HookContext<Room>

    let error: Error | null

    const checkDataOptions: Options = {
      fields: ['campus', 'name', 'day', 'startAt', 'duration'],
      numberFields: ['duration'],
      dateFields: ['startAt'],
    }

    describe('create', () => {
      const room: Room = {
        campus: 'blois',
        name: 'E.106',
        day: 'lundi',
        startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
        duration: 120,
      }

      beforeEach(() => {
        context = {
          app: {} as Application,
          service: {} as Service<Room>,
          method: 'create',
          params: {},
          path: serviceName,
          type: 'before',
        }

        result = null
        error = null
      })

      it('nothing should append with correct data', async () => {
        expect.assertions(2)

        context.data = Object.assign({}, room)

        try {
          result = (await checkData(checkDataOptions)(context)) as HookContext<
            Room
          >
        } catch (e) {
          error = e
        }

        expect(error).toBeNull()
        expect(result).toEqual(context)
      })

      it.each(Object.keys(room))(
        'should request correct fields (%s is missing)',
        async (key) => {
          expect.assertions(2)

          const tmp: Room = Object.assign({}, room)

          delete tmp[key]

          context.data = Object.assign({}, tmp)

          try {
            await checkData(checkDataOptions)(context)
          } catch (e) {
            error = e
          }

          expect(error).toBeInstanceOf(BadRequest)
          expect(error.message).toBe(`'${key}' is missing`)
        }
      )

      it.each(Object.keys(room))(
        'shoud request correct data (typeof %s is wrong)',
        async (key) => {
          expect.assertions(2)

          const tmp: Room = Object.assign({}, room)

          tmp[key] = 1
          if (typeof room[key] === 'number') {
            tmp[key] = 'data'
          }
          // @ts-ignore

          context.data = Object.assign({}, tmp)

          try {
            await checkData(checkDataOptions)(context)
          } catch (e) {
            error = e
          }

          expect(error).toBeInstanceOf(BadRequest)
          if (typeof room[key] === 'number') {
            expect(error.message).toBe(
              `type of '${key}' is incorrect, must be a number`
            )
          } else if (
            moment(new Date(room[key])).isValid() &&
            typeof room[key] !== 'number' &&
            key !== 'name'
          ) {
            expect(error.message).toBe(
              `type of '${key}' is incorrect, must be a date`
            )
          } else if (typeof room[key] === 'string') {
            expect(error.message).toBe(
              `type of '${key}' is incorrect, must be a string`
            )
          } else if (Array.isArray(room[key])) {
            expect(error.message).toBe(
              `type of '${key}' is incorrect, must be an array`
            )
          }
        }
      )

      it.each(Object.keys(room))(
        'should trim and sanitize the field %s',
        async (key) => {
          expect.assertions(1)

          const tmp: Room = Object.assign({}, room) as Room

          if (typeof tmp[key] === 'string') {
            tmp[key] = tmp[key] + '/                  '
          }

          context.data = Object.assign({}, tmp)

          try {
            result = (await checkData(checkDataOptions)(
              context
            )) as HookContext<Room>
          } catch (e) {
            error = e
          }

          if (typeof tmp[key] === 'string' && key !== 'startAt') {
            expect(result.data[key]).toBe(`${room[key]}&#x2F;`)
          } else if (key !== 'startAt') {
            expect(result.data[key]).toBe(room[key])
          } else if (key === 'startAt') {
            expect(error).toBeInstanceOf(BadRequest)
          }
        }
      )
    })

    describe('patch', () => {
      const room = {
        day: 'lundi',
        startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
        duration: 120,
      }

      beforeEach(() => {
        context = {
          app: {} as Application,
          service: {} as Service<Room>,
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
          result = (await checkData(checkDataOptions)(context)) as HookContext<
            Room
          >
        } catch (e) {
          error = e
        }

        expect(error).toBeNull()
        expect(result).toEqual(context)
      })

      it.each([
        ['campus', 1, "type of 'campus' is incorrect, must be a string"],
        ['startAt', 'data', "type of 'startAt' is incorrect, must be a date"],
        [
          'duration',
          'data',
          "type of 'duration' is incorrect, must be a number",
        ],
      ])('should request correct data for %s', async (key, value, expected) => {
        expect.assertions(1)

        const data = {}
        data[key] = value

        context.data = data as Room

        try {
          await checkData(checkDataOptions)(context)
        } catch (e) {
          error = e
        }

        expect(error.message).toBe(expected)
      })

      it.each(Object.keys(room))(
        'should trim and sanitize the field %s',
        async (key) => {
          expect.assertions(1)

          const tmp: Room = Object.assign({}, room) as Room

          if (typeof tmp[key] === 'string') {
            tmp[key] = tmp[key] + '/                  '
          }

          context.data = Object.assign({}, tmp)

          try {
            result = (await checkData(checkDataOptions)(
              context
            )) as HookContext<Room>
          } catch (e) {
            error = e
          }

          if (typeof tmp[key] === 'string' && key !== 'startAt') {
            expect(result.data[key]).toBe(`${room[key]}&#x2F;`)
          } else if (key !== 'startAt') {
            expect(result.data[key]).toBe(room[key])
          } else if (key === 'startAt') {
            expect(error).toBeInstanceOf(BadRequest)
          }
        }
      )

      it('should normalize a valid date', async () => {
        expect.assertions(2)

        const data = {
          startAt: 'Wed May 13 2020 23:54:46 GMT+0200',
        }

        context.data = Object.assign({}, data) as Room

        try {
          result = (await checkData(checkDataOptions)(context)) as HookContext<
            Room
          >
        } catch (e) {
          error = e
        }

        expect(error).toBeNull()
        expect(result.data.startAt).toEqual(
          new Date(data.startAt).toUTCString()
        )
      })
    })
  })

  describe("'posts'", () => {
    describe('create', () => {
      it.todo('nothing should append with correct data')
      it.todo('should request correct fields (%s is missing)')
      it.todo('shoud request correct data (typeof %s is wrong)')
      it.todo('should trim and sanitize the field %s')
    })
    describe('patch', () => {
      it.todo('should not throw an error if some data are missing')
      it.todo('should request correct data for %s')
      it.todo('should trim and sanitize the field %s')
      it.todo('should normalize a valid date')
    })
  })
})
