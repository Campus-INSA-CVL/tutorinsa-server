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
  it('should throw an error if there is no type', () => {
    const options = 'tuteur'
    context.data = Object.assign(
      {},
      {
        data: {
          type: 'tuteur',
        },
      }
    )
    try {
      isPost(options)(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe('a type is required')
  })

  it('should return true', () => {
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

  it('should return false', () => {
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
})
