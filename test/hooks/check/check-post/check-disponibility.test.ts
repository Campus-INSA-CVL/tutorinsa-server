import checkDisponibility from '../../../../src/hooks/check/check-post/check-disponibility'
import { Post, Room, Application, User } from '../../../../src/declarations'
import createDate from '../../../utils/createDate'
import app from '../../../../src/app'
import addDataToUser from '../../../utils/addDataToUser'
import { HookContext, Service, Paginated, Params } from '@feathersjs/feathers'
import { BadRequest, GeneralError } from '@feathersjs/errors'

describe("'check-disponibility' hook", () => {
  let context: HookContext<Partial<Post>>
  let result: HookContext<Partial<Post>>
  let error: Error | null
  const params: Params = {}

  let user: User = {
    lastName: 'fakeLastName',
    firstName: 'username',
    email: 'username@insa-cvl.fr',
    password: '$Azerty1',
    permissions: ['tuteur'],
    yearId: '',
    departmentId: '',
    favoriteSubjectsIds: [],
    difficultSubjectsIds: [],
    createdPostsIds: [],
  }

  let room: Room = {
    campus: 'blois',
    name: 'E.106',
    day: 'lundi',
    startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
    duration: 120,
  }

  let post: Post = {
    comment: 'hello post',
    type: 'tuteur',
    startAt: createDate(),
    duration: 60,
    studentsCapacity: 15,
    tutorsCapacity: 2,
    subjectId: '5ccaea940db44157d84e8c93',
    roomId: '',
    studentsIds: ['5ccaea940db44157d84e8c93'],
    tutorsIds: ['5ccaea940db44157d84e8c93'],
    creatorId: '5ccaea940db44157d84e8c93',
  }

  beforeAll(async () => {
    // Delete all the data from the rooms collection
    await app.get('mongooseClient').model('posts').find().deleteMany()
    await app.get('mongooseClient').model('rooms').find().deleteMany()
    await app.get('mongooseClient').model('users').find().deleteMany()

    try {
      room = await app.service('rooms').create(room)
    } catch (e) {
      // Error
    }
    try {
      await addDataToUser(user)
      user = await app.service('users').create(user)
    } catch (e) {
      // Error
    }

    post.roomId = room._id.toString()

    params.user = user

    try {
      post = (await app.service('posts').create(post, params)) as Post
    } catch (e) {
      // Do nothing, it just means the room already exists and can be tested
    }
  })

  beforeEach(() => {
    context = {
      app,
      service: {} as Service<any>,
      method: 'create',
      params: {},
      path: '',
      type: 'before',
    }

    result = null
    error = null
  })

  it('nothing should happens without data', async () => {
    try {
      result = (await checkDisponibility()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it('nothing should happens without a room in params', async () => {
    context.data = {}
    try {
      result = (await checkDisponibility()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('should work with correct data, using startAt from data (no posts find)', async () => {
    context.data = Object.assign({}, post, {
      post: { startAt: '2020-05-12T20:00:00.000+00:00' },
    })
    context.params = Object.assign({}, room)

    try {
      result = (await checkDisponibility()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })
  it('should work with correct data, using startAt from params (no posts find)', async () => {
    context.data = { duration: 56 }
    context.params = Object.assign(
      {},
      { room },
      {
        post: { startAt: '2020-05-12T20:00:00.000+00:00' },
      }
    )

    try {
      result = (await checkDisponibility()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeNull()
    expect(result).toEqual(context)
  })

  it("should throw an error if can't find posts", async () => {
    // @ts-ignore
    context.app = {}
    context.data = Object.assign({}, post)
    context.params = Object.assign({}, { room })

    try {
      result = (await checkDisponibility()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toBe('unable to fetch posts')
  })

  it("should throw an error if posts are find and method is 'create'", async () => {
    context.data = Object.assign({}, post)
    context.params = Object.assign({}, { room })

    try {
      result = (await checkDisponibility()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(
      `can't create a post with this room '${room.name}' at '${post.startAt}' because there is already a post for this room at this time`
    )
  })

  it('should throw an error if post id find is not the id (unable to patch)', async () => {
    // @ts-ignore
    context.method = 'patch'
    context.id = 'fake id'
    context.data = Object.assign({}, post)
    context.params = Object.assign({}, { room })

    try {
      result = (await checkDisponibility()(context)) as HookContext<Post>
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(
      `can't create a post with this room '${room.name}' at '${post.startAt}' because there is already a post for this room at this time`
    )
  })
})
