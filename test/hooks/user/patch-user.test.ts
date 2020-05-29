import patchUser from '../../../src/hooks/user/patch-user'
import app from '../../../src/app'
import {
  Post,
  Room,
  Calendar,
  User,
  UserCore,
  PostCore,
} from '../../../src/declarations'
import addDataToUser from '../../utils/addDataToUser'
import createDate from '../../utils/createDate'
import { HookContext, Service, Params, Paginated } from '@feathersjs/feathers'
import { GeneralError, NotAuthenticated } from '@feathersjs/errors'

describe("'patch-user' hook", () => {
  let context: HookContext<
    Post & {
      room: Room
      calendar?: Calendar
    }
  >

  let result: HookContext<
    Post & {
      room: Room
      calendar?: Calendar
    }
  >

  let post: Post
  let user: User
  let error: Error | null

  const params: Params = {}

  beforeAll(async () => {
    await app.get('mongooseClient').model('users').find().deleteMany()

    const dataUser: User = {
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: '$Azerty1',
      permissions: ['eleve'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
      createdPostsIds: [],
    }

    try {
      await addDataToUser(dataUser)
      user = await app.service('users').create(dataUser)
    } catch (e) {
      // Error
    }
    params.user = user

    post = {
      _id: '5ccaea940db44157d84e8c93',
      comment: 'hello there',
      type: 'eleve',
      startAt: createDate(),
      duration: 60,
      studentsCapacity: 15,
      tutorsCapacity: 2,
      subjectId: '5ccaea940db44157d84e8c93',
      roomId: '5ccaea940db44157d84e8c93',
      studentsIds: [],
      tutorsIds: [],
      creatorId: '5ccaea940db44157d84e8c93',
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
  it('should thow a error if the user is not in the params', async () => {
    expect.assertions(2)

    try {
      result = (await patchUser([['createdPostsIds', '_id', 'array']])(
        context
      )) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(NotAuthenticated)
    expect(error.message).toEqual(
      'a user must be authenticated to patch his data'
    )
  })

  it('should thow a error if there is no result', async () => {
    expect.assertions(2)

    context.params = Object.assign({}, params)

    try {
      result = (await patchUser([['createdPostsIds', '_id', 'array']])(
        context
      )) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toEqual(
      'something went wrong with the post creation (no result)'
    )
  })

  it('should thow a error if a incorrect field is passed through options', async () => {
    expect.assertions(2)

    // @ts-ignore
    context.result = Object.assign({}, post)
    context.params = Object.assign({}, params)

    const options = [['createdPostsIds', '_i', 'array']]
    try {
      // @ts-ignore
      result = (await patchUser(options)(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toEqual(
      `can't find this field (${options[0][1]}) on the result`
    )
  })

  it("should thow a error if the user can't be patch", async () => {
    expect.assertions(2)

    // @ts-ignore
    context.result = Object.assign({}, post)
    context.params = Object.assign({}, params)

    const options = [['createdPostsId', '_id', 'array']]

    try {
      // @ts-ignore
      result = (await patchUser(options)(context)) as HookContext
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(GeneralError)
    expect(error.message).toEqual('an error occured when the user was updated')
  })

  it('should patch the user (array to array)', async () => {
    expect.assertions(2)

    // @ts-ignore
    context.result = Object.assign({}, post)
    context.params = Object.assign({}, params)

    const options = [['createdPostsIds', '_id', 'array']]

    try {
      // @ts-ignore
      result = (await patchUser(options)(context)) as HookContext
    } catch (e) {
      error = e
    }

    let users: Paginated<User>
    try {
      users = (await app.service('users').find()) as Paginated<User>
    } catch (error) {
      //
    }

    expect(error).toBeNull()
    expect(users.data[0].createdPostsIds[0].toString()).toBe(
      post._id.toString()
    )
  })

  // it('should patch the user (string to array)', async () => {
  //   expect.assertions(2)

  //   // @ts-ignore
  //   context.result = Object.assign({}, post)
  //   context.params = Object.assign({}, params)

  //   const options = [['createdPostsIds', '_id', 'array']]

  //   try {
  //     // @ts-ignore
  //     result = (await patchUser(options)(context)) as HookContext
  //   } catch (e) {
  //     error = e
  //   }

  //   let users: Paginated<User>
  //   try {
  //     users = (await app.service('users').find()) as Paginated<User>
  //   } catch (error) {
  //     //
  //   }

  //   expect(error).toBeNull()
  //   expect(users.data[0].createdPostsIds[0].toString()).toBe(
  //     post._id.toString()
  //   )
  // })

  // it('should patch the user (string to string)', async () => {
  //   expect.assertions(2)

  //   // @ts-ignore
  //   context.result = Object.assign({}, post)
  //   context.params = Object.assign({}, params)

  //   const options = [['createdPostsIds', '_id', 'array']]

  //   try {
  //     // @ts-ignore
  //     result = (await patchUser(options)(context)) as HookContext
  //   } catch (e) {
  //     error = e
  //   }

  //   let users: Paginated<User>
  //   try {
  //     users = (await app.service('users').find()) as Paginated<User>
  //   } catch (error) {
  //     //
  //   }

  //   expect(error).toBeNull()
  //   expect(users.data[0].createdPostsIds[0].toString()).toBe(
  //     post._id.toString()
  //   )
  // })
})
