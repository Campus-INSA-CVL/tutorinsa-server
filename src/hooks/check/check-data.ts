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
  data: User | Year | Subject | Department | Post,
  options: Options
): User | Year | Subject | Department | Post {
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
function checkTypeofFields(
  data: User | Year | Subject | Department | Post,
  options: Options
): void {
  data = Object.assign({}, data)
  const keys: string[] = Object.keys(data)

  keys.forEach((key) => {
    // Must be an array
    if (options.arrayFields?.includes(key)) {
      // But it's not
      if (!Array.isArray(data[key])) {
        throw new BadRequest(`type of '${key}' is incorrect, must be an array`)
      }
      // Must be an number
    } else if (options.numberFields?.includes(key)) {
      // But it's not
      if (typeof data[key] !== 'number') {
        throw new BadRequest(`type of '${key}' is incorrect, must be a number`)
      }
      // Must be an date
    } else if (options.dateFields?.includes(key)) {
      if (
        !moment(new Date(data[key] as string)).isValid() ||
        typeof data[key] === 'number'
      ) {
        throw new BadRequest(`type of '${key}' is incorrect, must be a date`)
      }
    }
    // So, it's a string !
    else {
      // But it's not
      if (typeof data[key] !== 'string') {
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
function checkMissingFields(
  data: User | Year | Subject | Department | Post,
  fields: Options['fields']
) {
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
      // Sanitize before check type because of Date (can be valid before sanitized but invalid after sanitized)
      context.data = sanitizeStrings(data, options)
      checkTypeofFields(data, options)

      switch (path) {
        case 'users':
          break
        case 'years':
          break
        case 'departments':
          break
        case 'subjects':
          break
        case 'rooms':
          if ((context.data as Room)?.startAt) {
            ;(context.data as Room).startAt = normalizeDate(
              (context.data as Room).startAt
            )
          }
          break
        case 'posts':
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
