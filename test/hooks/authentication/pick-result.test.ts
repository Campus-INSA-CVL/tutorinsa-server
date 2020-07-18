import pickResult from '../../../src/hooks/authentication/pick-result'
import ability from '../../utils/ability'

import {
  HookContext,
  Application,
  Service,
  Paginated,
} from '@feathersjs/feathers'
import createDate from '../../utils/createDate'
import { Post } from '../../../src/declarations'
import { GeneralError } from '@feathersjs/errors'

// in theorie we have to define new ability here
describe("'pick-result' hook", () => {
  it('nothing should happens without result', async () => {
    let result: HookContext
    let error: Error | null = null
    try {
      result = (await pickResult()({
        params: {},
      } as HookContext)) as HookContext
    } catch (e) {
      error = e
    }
    expect(error).toBeNull()
    expect(result).toEqual({
      params: {},
    })
  })

  it('should throw an error if result is incorrect', async () => {
    const context: HookContext = {
      app: {} as Application,
      service: {} as Service<any>,
      method: 'find',
      params: { ability },
      path: 'posts',
      type: 'before',
      result: {},
    }
    let error: Error | null = null
    try {
      await pickResult()(context)
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toBe('the pattern of the result is uncorrect')
  })

  describe('paginated data', () => {
    let context: HookContext<Paginated<Post>>
    let result: HookContext<Paginated<Post>>
    let error: Error | null
    beforeEach(() => {
      const post: Post = {
        _id: '5ccaea940db44157d84e8c95',
        comment: 'hello there',
        type: 'tuteur',
        startAt: createDate(),
        duration: 60,
        studentsCapacity: 15,
        tutorsCapacity: 2,
        subjectId: '5ccaea940db44157d84e8c93',
        roomId: '',
        studentsIds: [],
        tutorsIds: [],
        creatorId: '5ccaea940db44157d84e8c93',
      }
      context = {
        app: {} as Application,
        service: {} as Service<any>,
        method: 'find',
        params: { ability },
        path: 'posts',
        type: 'before',
        result: { total: 2, limit: 10, skip: 0, data: [post, post] },
      }
      error = null
    })

    it('should remove unreadable field', async () => {
      try {
        result = (await pickResult()(context)) as HookContext<Paginated<Post>>
      } catch (e) {
        error = e
      }
      expect(error).toBeNull()
      expect(result.result.total).toBe(2)
      expect(result.result.data).toBeDefined()
      expect(result.result.data[0]).toEqual({
        _id: '5ccaea940db44157d84e8c95',
        comment: 'hello there',
        type: 'tuteur',
        startAt: createDate(),
        duration: 60,
        subjectId: '5ccaea940db44157d84e8c93',
      })
      expect(result.result.data[1]).toEqual({
        _id: '5ccaea940db44157d84e8c95',
        comment: 'hello there',
        type: 'tuteur',
        startAt: createDate(),
        duration: 60,
        subjectId: '5ccaea940db44157d84e8c93',
      })
    })
  })

  describe('not paginated data', () => {
    let context: HookContext<Post[]>
    let result: HookContext<Post[]>
    let error: Error | null
    beforeEach(() => {
      const post: Post = {
        _id: '5ccaea940db44157d84e8c95',
        comment: 'hello there',
        type: 'tuteur',
        startAt: createDate(),
        duration: 60,
        studentsCapacity: 15,
        tutorsCapacity: 2,
        subjectId: '5ccaea940db44157d84e8c93',
        roomId: '',
        studentsIds: [],
        tutorsIds: [],
        creatorId: '5ccaea940db44157d84e8c93',
      }

      context = {
        app: {} as Application,
        service: {} as Service<any>,
        method: 'find',
        params: { ability },
        path: 'posts',
        type: 'before',
        result: [post, post],
      }
      error = null
    })

    it('should remove unreadable field', async () => {
      try {
        result = (await pickResult()(context)) as HookContext<Post[]>
      } catch (e) {
        error = e
      }
      expect(error).toBeNull()
      expect(result.result[0]).toEqual({
        _id: '5ccaea940db44157d84e8c95',
        comment: 'hello there',
        type: 'tuteur',
        startAt: createDate(),
        duration: 60,
        subjectId: '5ccaea940db44157d84e8c93',
      })
      expect(result.result[1]).toEqual({
        _id: '5ccaea940db44157d84e8c95',
        comment: 'hello there',
        type: 'tuteur',
        startAt: createDate(),
        duration: 60,
        subjectId: '5ccaea940db44157d84e8c93',
      })
    })
  })

  describe('single data', () => {
    let context: HookContext<Post>
    let result: HookContext<Post>
    let error: Error | null
    beforeEach(() => {
      const post: Post = {
        _id: '5ccaea940db44157d84e8c95',
        comment: 'hello there',
        type: 'tuteur',
        startAt: createDate(),
        duration: 60,
        studentsCapacity: 15,
        tutorsCapacity: 2,
        subjectId: '5ccaea940db44157d84e8c93',
        roomId: '',
        studentsIds: [],
        tutorsIds: [],
        creatorId: '5ccaea940db44157d84e8c93',
      }

      context = {
        app: {} as Application,
        service: {} as Service<any>,
        method: 'get',
        params: { ability },
        path: 'posts',
        type: 'before',
        result: post,
      }
      error = null
    })

    it('should remove unreadable field', async () => {
      try {
        result = (await pickResult()(context)) as HookContext<Post>
      } catch (e) {
        error = e
      }
      expect(error).toBeNull()
      expect(result.result).toEqual({
        _id: '5ccaea940db44157d84e8c95',
        comment: 'hello there',
        type: 'tuteur',
        startAt: createDate(),
        duration: 60,
        subjectId: '5ccaea940db44157d84e8c93',
      })
    })
  })
})
