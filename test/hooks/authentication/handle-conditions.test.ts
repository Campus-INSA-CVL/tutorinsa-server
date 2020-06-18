import handleConditions from '../../../src/hooks/authentication/handle-conditions'
import app from '../../../src/app'
import ability from '../../utils/ability'

import { HookContext, Application, Service } from '@feathersjs/feathers'
import { Subject } from '../../../src/declarations'
import { Forbidden } from '@feathersjs/errors'

describe("'handle-conditions' hook", () => {
  let result: HookContext
  let context: HookContext
  let error: Error | null

  let subject: Subject

  beforeAll(async () => {
    await app.get('mongooseClient').model('subjects').find().deleteMany()

    try {
      subject = await app.service('subjects').create({ name: 'eps' })
    } catch (e) {
      //
    }
  })

  beforeEach(() => {
    context = {
      app,
      service: {} as Service<any>,
      method: 'find',
      params: { ability, query: {} },
      path: 'years',
      type: 'before',
      result: {},
    }

    error = null
  })
  it('nothing should happend without ability', async () => {
    context.params = {}
    try {
      result = (await handleConditions()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  describe('without id', () => {
    describe('find', () => {
      it('should add conditions to params', async () => {
        try {
          result = (await handleConditions()(context)) as HookContext
        } catch (e) {
          error = e
        }

        expect(error).toBeNull()
        expect(result.params.query).toEqual({ $or: [{ name: '3a' }] })
      })
    })
    describe('create', () => {
      it("should throw an error if a user can't create a ressource", async () => {
        // @ts-ignore
        context.method = 'create'
        // @ts-ignore
        context.path = 'subjects'
        context.data = { name: 'culture et communication' }

        try {
          await handleConditions()(context)
        } catch (e) {
          error = e
        }

        expect(error).toBeInstanceOf(Forbidden)
        expect(error.message).toBe(
          `You are not allowed to ${context.method} on ${context.path}`
        )
      })
    })
  })
  describe('with id', () => {
    it("should throw an error if a user can't access to a ressource", async () => {
      // @ts-ignore
      context.method = 'get'
      // @ts-ignore
      context.path = 'subjects'
      context.id = subject._id.toString()

      try {
        await handleConditions()(context)
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(Forbidden)
      expect(error.message).toBe(
        `You are not allowed to ${context.method} on ${context.path}`
      )
    })
  })
})
