import removeUnwantedFields from '../../src/hooks/remove-unwanted-fields'
import { Post } from '../../src/declarations'
import { HookContext, Application, Service } from '@feathersjs/feathers'

describe("'remove-unwanted-fields' hook", () => {
  let context: HookContext<Post>

  let error: Error | null
  let result: HookContext<Post>

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
  it('nothing should append without data and options', async () => {
    expect.assertions(2)

    try {
      result = (await removeUnwantedFields()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('nothing should append without options', async () => {
    expect.assertions(2)

    const data = { comment: 'Hello everyone !' }

    context.data = data as Post

    try {
      result = (await removeUnwantedFields()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('nothing should append without data', async () => {
    expect.assertions(2)

    try {
      result = (await removeUnwantedFields(['data'])(context)) as HookContext<
        Post
      >
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it.each(['creatorId', 'studentsIds'])(
    'field %s should have been deleted',
    async (key) => {
      expect.assertions(2)
      const data: object = {}
      data[key] = 'data'

      context.data = data as Post

      try {
        result = (await removeUnwantedFields([key])(context)) as HookContext<
          Post
        >
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result.data[key]).toBeUndefined()
    }
  )

  it('should delete many fields in one time', async () => {
    expect.assertions(4)

    const data = {
      comment: 'some data',
      studentsIds: ['data ?'],
      tutorsIds: ['yes, data !'],
    }

    context.data = data as Post

    try {
      result = (await removeUnwantedFields(['studentsIds', 'tutorsIds'])(
        context
      )) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result.data.comment).toBe(data.comment)
    expect(result.data.studentsIds).toBeUndefined()
    expect(result.data.tutorsIds).toBeUndefined()
  })
})
