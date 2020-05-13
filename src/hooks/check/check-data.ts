// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import validator from 'validator'
import { BadRequest } from '@feathersjs/errors'
import { Year, Subject, Department, User, Room } from '../../declarations'
import moment from '../../utils/moment'

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
 * Trim and sanitize data property
 * @param data an object whose data will sanitize
 * @returns the sanitized object
 */
function sanitizeStrings(
  data: User | Room,
  unwantedFields?: string[]
): User | Room {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key]

      if (typeof element === 'string' && !unwantedFields?.includes(key)) {
        data[key] = trimSanitize(element)
      } else if (Array.isArray(element) && !unwantedFields?.includes(key)) {
        const tmp: string[] = []
        element.forEach((el: string) => {
          tmp.push(trimSanitize(el))
        })
        data[key] = tmp
      }
    }
  }

  return data
}

/**
 * Check the type of fields, depending of params
 * @param data an object
 * @param arrayFields array key for array fields
 * @param numberFields array key for number fields
 * @param dateFields array key for date fields
 */
function checkTypeofFields(
  data: any,
  arrayFields?: string[],
  numberFields?: string[],
  dateFields?: string[]
): void {
  data = Object.assign({}, data)
  const keys: string[] = Object.keys(data as any)

  keys.forEach((key) => {
    // Must be an array
    if (arrayFields?.includes(key)) {
      // But it's not
      if (!Array.isArray((data as any)[key])) {
        throw new BadRequest(`type of '${key}' is incorrect, must be an array`)
      }
      // Must be an number
    } else if (numberFields?.includes(key)) {
      // But it's not
      if (typeof (data as any)[key] !== 'number') {
        throw new BadRequest(`type of '${key}' is incorrect, must be a number`)
      }
      // Must be an date
    } else if (dateFields?.includes(key)) {
      if (
        !moment(new Date(data[key])).isValid() ||
        typeof data[key] === 'number'
      ) {
        throw new BadRequest(`type of '${key}' is incorrect, must be a date`)
      }
    }
    // So, it's a string !
    else {
      // But it's not
      if (typeof (data as any)[key] !== 'string') {
        throw new BadRequest(`type of '${key}' is incorrect, must be a string`)
      }
    }
  })
}

/**
 * Normalize a date (to UTC)
 * @param date
 */
function normalizeDate(date: string): string {
  return new Date(date).toUTCString()
}

/**
 * Validate (type) and sanitize data from the hook context (able to manage many services)
 */
export default (options = {}): Hook => {
  return async (context: HookContext<User | Year | Subject | Department>) => {
    const { path, method, data } = context

    // Fields of user which are array
    const arrayFieldsUser = [
      'permissions',
      'favoriteSubjectsIds',
      'difficultSubjectsIds',
    ]

    // Fields of user which will be not sanitize
    const unwantedFieldsUser = ['password', 'email']

    // Fields of room which are number
    const numberFieldsRoom = ['duration']

    // Fields of room which are date
    const dateFieldsRoom = ['startAt']

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
              // Here we are sure that all fields are present
              break
            case 'patch':
              break
            default:
              break
          }
          // Check typeof user fields
          checkTypeofFields(data as User, arrayFieldsUser)
          // Valid case
          ;(context.data as User) = sanitizeStrings(
            data as User,
            unwantedFieldsUser
          ) as User
          break
        case 'years':
          // Check the presence of the field
          if (!(data as Year).name) {
            throw new BadRequest('request must contain correct fields')
          }
          // Here we are sure that all fields are present
          // Check typeof user fields
          checkTypeofFields(data as Year)
          // Valid case
          ;(data as Year).name = trimSanitize((data as Year).name)

          break
        case 'departments':
          // Check the presence of the field
          if (!(data as Department).name) {
            throw new BadRequest('request must contain correct fields')
          }
          // Here we are sure that all fields are present
          // Check typeof user fields
          checkTypeofFields(data as Department)
          // Valid case
          ;(data as Department).name = trimSanitize((data as Department).name)

          break
        case 'subjects':
          // Check the presence of the field
          if (!(data as Subject).name) {
            throw new BadRequest('request must contain correct fields')
          }
          // Here we are sure that all fields are present
          // Check typeof user fields
          checkTypeofFields(data as Subject)
          // Valid case
          ;(data as Subject).name = trimSanitize((data as Subject).name)
          break
        case 'rooms':
          switch (method) {
            case 'create':
              if (
                !(data as Room).campus ||
                !(data as Room).name ||
                !(data as Room).day ||
                !(data as Room).startAt ||
                !(data as Room).duration
              ) {
                throw new BadRequest('some data are missing')
              }
              // Here we are sure that all fields are present
              break
            case 'patch':
              break
            default:
              break
          }

          // Sanitize before check type because of Date (can be valid before sanitized but invalid after sanitized)
          ;(context.data as Room) = sanitizeStrings(data as Room) as Room
          // Check typeof room fields
          checkTypeofFields(data as Room, [], numberFieldsRoom, dateFieldsRoom)

          // Valid case
          if ((context.data as Room)?.startAt) {
            ;(context.data as Room).startAt = normalizeDate(
              (context.data as Room).startAt
            )
          }
          break
        default:
          break
      }
    }

    return context
  }
}
