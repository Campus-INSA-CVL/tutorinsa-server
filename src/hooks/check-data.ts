// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import validator from 'validator'
import { BadRequest } from '@feathersjs/errors'
import {
  UserPermission,
  Year,
  Subject,
  Department,
  User,
} from '../declarations'

/**
 * Trim and sanitize a string
 * @param value a string to trim and sanitize
 * @returns a trimed and sanitized string
 */
function trimSanitize(value: string): string {
  value = validator.trim(value)
  value = validator.escape(value)
  return value
}

/**
 * Trim and sanitize data property from a user
 * @param user a user whose data will sanitize
 * @returns a user
 */
function sanitizeUser(user: User): User {
  for (const key in user) {
    if (user.hasOwnProperty(key)) {
      const element = user[key] as string | string[] | UserPermission[]

      if (typeof element === 'string') {
        user[key] = trimSanitize(element)
      } else if (Array.isArray(element)) {
        const tmp: string[] = []
        element.forEach((el: string | UserPermission) => {
          tmp.push(trimSanitize(el))
        })
        user[key] = tmp
      }
    }
  }

  return user
}

/**
 * Validate and sanitize data from the hook context (able to manage many services)
 */
export default (options = {}): Hook => {
  return async (context: HookContext<User | Year | Subject | Department>) => {
    const { path, method, data } = context

    if (data) {
      switch (path) {
        case 'users':
          // Depends of the method which if called
          switch (method) {
            case 'create':
              // Check the presence of the field
              if (
                !(data as User).lastName ||
                !(data as User).firstName ||
                !(data as User).email ||
                !(data as User).password ||
                !(data as User).permissions ||
                !(data as User).yearId ||
                !(data as User).departmentId ||
                !(data as User).favoriteSubjectsIds ||
                !(data as User).difficultSubjectsIds
              ) {
                throw new BadRequest('some data are missing')
              }
              if (typeof (data as User).lastName !== 'string')
                throw new BadRequest("type of 'lastName' is incorrect")
              if (typeof (data as User).firstName !== 'string')
                throw new BadRequest("type of 'firstName' is incorrect")
              if (typeof (data as User).email !== 'string')
                throw new BadRequest("type of 'email' is incorrect")
              if (typeof (data as User).password !== 'string')
                throw new BadRequest("type of 'password' is incorrect")
              if (typeof (data as User).yearId !== 'string')
                throw new BadRequest("type of 'yearId' is incorrect")
              if (typeof (data as User).departmentId !== 'string')
                throw new BadRequest("type of 'departmentId' is incorrect")
              if (!Array.isArray((data as User).permissions))
                throw new BadRequest("type of 'permissions' is incorrect")
              if (!Array.isArray((data as User).favoriteSubjectsIds))
                throw new BadRequest(
                  "type of 'favoriteSubjectsIds' is incorrect"
                )
              if (!Array.isArray((data as User).difficultSubjectsIds))
                throw new BadRequest(
                  "type of 'difficultSubjectsIds' is incorrect"
                )

                // Valid case
              ;(context.data as User) = sanitizeUser(data as User)

              break
            case 'patch':
              break
            default:
              break
          }
          break
        case 'years':
          if (!(data as Year).name) {
            throw new BadRequest('request must contain correct fields')
          }
          if (typeof (data as Year).name !== 'string') {
            throw new BadRequest('name must be a string')
          } else {
            // Valid case
            const { name } = data as Year
            ;(data as Year).name = trimSanitize(name)
          }
          break
        case 'departments':
          if (!(data as Department).name) {
            throw new BadRequest('request must contain correct fields')
          }
          if (typeof (data as Department).name !== 'string') {
            throw new BadRequest('name must be a string')
          } else {
            // Valid case
            const { name } = data as Department
            ;(data as Department).name = trimSanitize(name)
          }
          break
        case 'subjects':
          if (!(data as Subject).name) {
            throw new BadRequest('request must contain correct fields')
          }
          if (typeof (data as Subject).name !== 'string') {
            throw new BadRequest('name must be a string')
          } else {
            // Valid case
            // Trim and sanitize
            const { name } = data as Subject
            ;(data as Subject).name = trimSanitize(name)
          }
          break
        default:
          break
      }
    }

    return context
  }
}
