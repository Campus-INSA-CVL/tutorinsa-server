import { BadRequest, GeneralError } from '@feathersjs/errors'
import {
  HookContext,
  Application,
  Service,
  Params,
  Paginated,
} from '@feathersjs/feathers'
import app from '../../../src/app'
import addPost from '../../../src/hooks/add/add-post'
import { Post, Room, User } from '../../../src/declarations'
import addDataToUser from '../../utils/addDataToUser'
import createDate from '../../utils/createDate'
import moment from '../../../src/utils/moment'

describe("'add-post' hook", () => {
  let context: HookContext<any>

  let result: HookContext<any>
  let error: Error | null

  let resultPost: Post | null = null
  let post: Post | null = null

  const params: Params = {}

  const dataRoom: Room = {
    campus: 'blois',
    name: 'E.106',
    day: 'lundi',
    startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
    duration: 120,
  }

  const dataUser: User = {
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

  let room: Room
  let user: User

  beforeAll(async () => {
    // Delete all the data from the rooms collection
    await app.get('mongooseClient').model('posts').find().deleteMany()
    await app.get('mongooseClient').model('rooms').find().deleteMany()
    await app.get('mongooseClient').model('users').find().deleteMany()
    await app.get('mongooseClient').model('calendars').find().deleteMany()

    try {
      room = await app.service('rooms').create(dataRoom)
    } catch (e) {
      // Error
    }
    try {
      await addDataToUser(dataUser)
      user = await app.service('users').create(dataUser)
    } catch (e) {
      // Error
    }
    params.user = user

    let results: Paginated<Post>

    post = {
      comment: 'hello post',
      type: 'tuteur',
      startAt: createDate(),
      duration: 60,
      studentsCapacity: 15,
      tutorsCapacity: 2,
      subjectId: '5ccaea940db44157d84e8c93',
      roomId: room._id.toString(),
      studentsIds: ['5ccaea940db44157d84e8c93'],
      tutorsIds: ['5ccaea940db44157d84e8c93'],
      creatorId: '5ccaea940db44157d84e8c93',
    }

    results = (await app.service('posts').find({
      query: { comment: post.comment },
    })) as Paginated<Post>

    resultPost = results.data[0]
    if (!resultPost) {
      try {
        resultPost = (await app.service('posts').create(post, params)) as Post
      } catch (e) {
        // Do nothing, it just means the room already exists and can be tested
      }
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
  it('should throw an error if there is no id', async () => {
    try {
      await addPost()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(`'undefined' is not a correct id`)
  })
  it('should throw an error if the id is not correct', async () => {
    const id = null

    context.id = id

    try {
      await addPost()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(BadRequest)
    expect(error.message).toBe(`'${id}' is not a correct id`)
  })
  it("should throw an error if the service can't get the post", async () => {
    const id = '5ed7aeea6d584e7360449989'

    context.id = id
    try {
      await addPost()(context)
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toBe('get post encountered an error')
  })

  it('should add a post to the params', async () => {
    const id = resultPost._id.toString()

    context.id = id
    try {
      result = (await addPost()(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(result.params.post).toBeDefined()
    expect(result.params.post).toEqual({
      ...resultPost,
      endAt: moment.utc(resultPost.startAt).hours(21).toISOString(),
      fullStudents: false,
      fullTutors: false,
    })
  })
})
