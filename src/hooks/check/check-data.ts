// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Id } from '@feathersjs/feathers'
import validator from 'validator'
import { BadRequest } from '@feathersjs/errors'
import {
  Year,
  Subject,
  Department,
  User,
  Room,
  Post,
  Options,
} from '../../declarations'
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
 * @param options
 * @returns the sanitized object
 */
function sanitizeStrings(
  data: User | Room | Post,
  options: Options
): User | Room | Post {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key]

      if (
        typeof element === 'string' &&
        !options.unwantedFields?.includes(key)
      ) {
        data[key] = trimSanitize(element)
      } else if (
        Array.isArray(element) &&
        !options.unwantedFields?.includes(key)
      ) {
        const tmp: string[] = []
        element.forEach((el: string | Id) => {
          tmp.push(trimSanitize(el.toString()))
        })
        data[key] = tmp
      }
    }
  }

  return data
}

/**
 * Normalize a date (to UTC)
 * @param date
 */
function normalizeDate(date: string): string {
  return new Date(date).toUTCString()
}

/**
 * Check the type of fields, depending of params
 * @param data
 * @param options
 */
function checkTypeofFields(data: any, options: Options): void {
  data = Object.assign({}, data)
  const keys: string[] = Object.keys(data as any)

  keys.forEach((key) => {
    // Must be an array
    if (options.arrayFields?.includes(key)) {
      // But it's not
      if (!Array.isArray((data as any)[key])) {
        throw new BadRequest(`type of '${key}' is incorrect, must be an array`)
      }
      // Must be an number
    } else if (options.numberFields?.includes(key)) {
      // But it's not
      if (typeof (data as any)[key] !== 'number') {
        throw new BadRequest(`type of '${key}' is incorrect, must be a number`)
      }
      // Must be an date
    } else if (options.dateFields?.includes(key)) {
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
 * Check if data contains all the wanted fields
 * @param data
 * @param fields
 */
function checkMissingFields(data: any, fields: Options['fields']) {
  // All keys from the data
  const keys = Object.keys(data)
  // Compare data keys and wanted keys
  fields.forEach((field) => {
    if (!keys.includes(field)) {
      throw new BadRequest(`'${field}' is missing`)
    }
  })
}

/**
 * Validate (type) and sanitize data from the hook context (able to manage many services)
 */
export default (options: Options): Hook => {
  return async (
    context: HookContext<User | Year | Subject | Department | Post>
  ) => {
    const { path, method, data } = context

    if (data) {
      switch (method) {
        case 'create':
          checkMissingFields(data, options.fields)
          break
        default:
          break
      }
      switch (path) {
        case 'users':
          // Check typeof user fields
          checkTypeofFields(data as User, options)
          // Valid case
          ;(context.data as User) = sanitizeStrings(
            data as User,
            options
          ) as User
          break
        case 'years':
          checkTypeofFields(data as Year, options)
          // Valid case
          ;(data as Year).name = trimSanitize((data as Year).name)

          break
        case 'departments':
          checkTypeofFields(data as Department, options)
          // Valid case
          ;(data as Department).name = trimSanitize((data as Department).name)

          break
        case 'subjects':
          checkTypeofFields(data as Subject, options)
          // Valid case
          ;(data as Subject).name = trimSanitize((data as Subject).name)
          break
        case 'rooms':
          // Sanitize before check type because of Date (can be valid before sanitized but invalid after sanitized)
          ;(context.data as Room) = sanitizeStrings(
            data as Room,
            options
          ) as Room
          // Check typeof room fields
          checkTypeofFields(data as Room, options)

          // Valid case
          if ((context.data as Room)?.startAt) {
            ;(context.data as Room).startAt = normalizeDate(
              (context.data as Room).startAt
            )
          }
          break
        case 'posts':
          // Sanitize before check type because of Date (can be valid before sanitized but invalid after sanitized)
          ;(context.data as Post) = sanitizeStrings(
            data as Post,
            options
          ) as Post
          // Check typeof post fields
          checkTypeofFields(data as Post, options)

          // Valid case
          if ((context.data as Post)?.startAt) {
            ;(context.data as Post).startAt = normalizeDate(
              (context.data as Post).startAt
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
