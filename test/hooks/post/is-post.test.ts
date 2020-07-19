import isPost from '../../../src/hooks/post/is-post'
import { Application } from '../../../src/declarations'
import { Service, HookContext } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'is-post' hook", () => {
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
  it("should throw an error if there is no type and methode is 'create'", () => {
    const options = 'tuteur'
    context.data = {}
    try {
      isPost(options)(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe('a type is required')
  })

  it("nothing should happens without type and method different that 'create'", () => {
    const options = 'tuteur'

    // @ts-ignore
    context.method = 'patch'
    context.data = {}
    try {
      isPost(options)(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
  })

  it('should return true, data', () => {
    const options = 'tuteur'
    context.data = Object.assign(
      {},
      {
        type: 'tuteur',
      }
    )

    const bool = isPost(options)(context)

    expect(bool).toBe(true)
  })

  it('should return false, data', () => {
    const options = 'tuteur'
    context.data = Object.assign(
      {},
      {
        type: 'eleve',
      }
    )

    const bool = isPost(options)(context)

    expect(bool).toBe(false)
  })

  it('should return true, params', () => {
    // @ts-ignore
    context.method = 'patch'
    const options = 'tuteur'
    context.params = Object.assign(
      {},
      {
        post: {
          type: 'tuteur',
        },
      }
    )

    const bool = isPost(options)(context)

    expect(bool).toBe(true)
  })

  it('should return false, params', () => {
    // @ts-ignore
    context.method = 'patch'
    const options = 'tuteur'
    context.params = Object.assign(
      {},
      {
        post: {
          type: 'eleve',
        },
      }
    )

    const bool = isPost(options)(context)

    expect(bool).toBe(false)
  })
})
