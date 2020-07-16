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
  CheckDataOptions,
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
function sanitizeStrings<T>(
  data: T & { [key: string]: string },
  options: CheckDataOptions<T>
): T {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key]

      if (
        typeof element === 'string' &&
        !(options.unwantedFields as string[])?.includes(key)
      ) {
        // @ts-ignore unexpected error
        data[key] = trimSanitize(element)
      } else if (
        Array.isArray(element) &&
        !(options.unwantedFields as string[])?.includes(key)
      ) {
        const tmp: string[] = []
        element.forEach((el: string | Id) => {
          tmp.push(trimSanitize(el.toString()))
        })
        // @ts-ignore unexpected error
        data[key] = tmp
      }
    }
  }

  return data
}

/**
 * Check the type of fields, depending of params
 * @param data
 * @param options
 */
function checkTypeofFields<T>(
  data: T & { [key: string]: string },
  options: CheckDataOptions<T>
): void {
  data = Object.assign({}, data)
  const keys: string[] = Object.keys(data)

  keys.forEach((key) => {
    if ((options.excludeFields as string[])?.includes(key)) {
      return
    }
    // Must be an array
    if ((options.arrayFields as string[])?.includes(key)) {
      // But it's not
      if (!Array.isArray(data[key])) {
        throw new BadRequest(`type of '${key}' is incorrect, must be an array`)
      }
    }
    // Must be an number
    else if ((options.numberFields as string[])?.includes(key)) {
      // But it's not
      if (typeof data[key] !== 'number') {
        throw new BadRequest(`type of '${key}' is incorrect, must be a number`)
      }
    }
    // Must be an date
    else if ((options.dateFields as string[])?.includes(key)) {
      if (
        !moment(new Date(data[key] as string)).isValid() ||
        typeof data[key] === 'number'
      ) {
        throw new BadRequest(`type of '${key}' is incorrect, must be a date`)
      }
    }
    // Must be a boolean
    else if ((options.booleanFields as string[])?.includes(key)) {
      if (typeof data[key] !== 'boolean') {
        throw new BadRequest(`type of '${key}' is incorrect, must be a boolean`)
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
function checkMissingFields<T>(data: T, fields: CheckDataOptions<T>['fields']) {
  // All keys from the data
  const keys = Object.keys(data)
  // Compare data keys and wanted keys
  fields.forEach((field) => {
    if (!keys.includes(field.toString())) {
      throw new BadRequest(`'${field}' is missing`)
    }
  })
}

/**
 * Validate (type) and sanitize data from the hook context (able to manage many services)
 */
export default <T>(options: CheckDataOptions<T>): Hook => {
  return async (context: HookContext<T>) => {
    const { method, data } = context

    if (data) {
      if (method === 'create') {
        checkMissingFields(data, options.fields)
      }
      // Sanitize before check type because of Date (can be valid before sanitized but invalid after sanitized)
      context.data = sanitizeStrings(
        data as T & { [key: string]: string },
        options
      )
      checkTypeofFields(data as T & { [key: string]: string }, options)
    }

    return context
  }
}
