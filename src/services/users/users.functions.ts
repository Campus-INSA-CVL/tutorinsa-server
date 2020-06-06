import {
  User,
  UserCore,
  Subscription,
  Post,
  PostCore,
} from '../../declarations'
import { GeneralError } from '@feathersjs/errors'
import { Id, Params } from '@feathersjs/feathers'

type AllowedFieldsWithType<Obj, Type> = {
  [K in keyof Obj]: Obj[K] extends Type ? K : never
}

type ExtractFieldsOfType<Obj, Type> = AllowedFieldsWithType<
  Obj,
  Type
>[keyof Obj]

/**
 * Return an array without the post id using the user data
 * @param {T} previous
 * @param {ExtractFieldsOfType<T, Id[]>} field
 * @param {Id} id
 * @returns {Id[]} an array without the post id but with the other from the user
 */
function removeId(
  previous: Post | User,
  field:
    | 'studentsIds'
    | 'tutorsIds'
    | 'studentSubscriptionsIds'
    | 'tutorSubscriptionsIds'
    | 'createdPostsIds',
  id: Id
): Id[] {
  if (!field) {
    return []
  }
  return [
    ...(previous[field] as Id[]).filter(
      (idFromField: Id) => idFromField.toString() !== id.toString()
    ),
  ]
}

/**
 * Return an array with the new and previous post id using the user data
 * @param {Post | User} previous
 * @param {ExtractFieldsOfType<UserCore, Id[]> | ExtractFieldsOfType<PostCore, Id[]>} field
 * @param {Id} id
 * @returns {Id[]} an array with the new id
 */
function addId(
  previous: Post | User,
  field:
    | 'studentsIds'
    | 'tutorsIds'
    | 'studentSubscriptionsIds'
    | 'tutorSubscriptionsIds'
    | 'createdPostsIds',
  id: Id
): Id[] {
  if (!field) {
    return []
  }
  return [...(previous[field] as Id[]), id]
}

/**
 * Add or remove a post id from data to patch the createdPostsIds field from the user
 * @param {Partial<User>} data some fields from a user used to patch a user
 * @param {User} user
 * @returns {Partial<User>} the updated data
 */
function updateCreatedPostsIds(data: Partial<User>, user: User): Partial<User> {
  if (data.createdPostsIds) {
    if (typeof data.createdPostsIds === 'string') {
      data.createdPostsIds = [data.createdPostsIds]
    }

    if (data.createdPostsIds.length > 1) {
      throw new GeneralError('only one post id can be provided to patch a user')
    }

    if (
      user.createdPostsIds.find(
        (createdPostId) =>
          createdPostId.toString() === data.createdPostsIds!.toString()
      )
    ) {
      data.createdPostsIds = removeId(
        user,
        'createdPostsIds',
        data.createdPostsIds[0]
      )
    } else {
      data.createdPostsIds = addId(
        user,
        'createdPostsIds',
        data.createdPostsIds[0]
      )
    }
  }
  return data
}

/**
 * Add or remove id from subscription fields to patch the user
 * @param {Partial<User>} data some fields from a user used to patch a user
 * @param {User} user
 * @param {object} params
 * @returns {Partial<User>} the updated data
 */
function updateSubcriptions(
  data: Partial<User | Post>,
  previous: User | Post,
  params: Params & { subType?: Subscription['type'] }
): Partial<User | Post> {
  if (data) {
    if (params.subType) {
      const fields = Object.keys(data) as [
        | 'studentsIds'
        | 'tutorsIds'
        | 'studentSubscriptionsIds'
        | 'tutorSubscriptionsIds'
      ]

      if (fields[0]) {
        if (params.subType === 'subscribe') {
          data[fields[0]] = addId(
            previous,
            fields[0],
            (data[fields[0]] as Id[])[0]
          )
        } else if (params.subType === 'unsubscribe') {
          data[fields[0]] = removeId(
            previous,
            fields[0],
            (data[fields[0]] as Id[])[0]
          )
        } else {
          throw new GeneralError(
            `'${params.subType}' this type is unknow (subscription service)`
          )
        }
      }
    }
  }
  return data
}

export { updateCreatedPostsIds, updateSubcriptions }
