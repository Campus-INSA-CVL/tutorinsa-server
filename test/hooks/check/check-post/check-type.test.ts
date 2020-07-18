import checkType from '../../../../src/hooks/check/check-post/check-type'
import { Post, PostType } from '../../../../src/declarations'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { BadRequest } from '@feathersjs/errors'

describe("'check-type' hook", () => {
  let context: HookContext<Post>

  let error: Error | null
  let result: HookContext<Post>

  const typesOptions: PostType[] = ['eleve', 'tuteur']
  const fieldName = 'type'

  beforeEach(() => {
    context = {
      app: {} as Application,
      service: {} as Service<Post>,
      method: 'create',
      params: {},
      path: '',
      type: 'before',
    }
    result = null
    error = null
  })

  it('nothing should happenss without data', async () => {
    expect.assertions(2)

    try {
      result = (await checkType(
        fieldName,
        typesOptions
      )(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it.each(['eleve', 'tuteur'])(
    'nothing should happenss with correct data (%s)',
    async (value) => {
      expect.assertions(2)

      const data = { type: value }

      context.data = Object.assign({}, data) as Post
      try {
        result = (await checkType(
          fieldName,
          typesOptions
        )(context)) as HookContext<Post>
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result).toEqual(context)
    }
  )

  it('should thow an error because of incorrect field', async () => {
    expect.assertions(2)

    const data = { type: 'random' }

    context.data = Object.assign({}, data) as Post
    try {
      result = (await checkType(
        fieldName,
        typesOptions
      )(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(`${data.type} is an incorrect type`)
  })
})
