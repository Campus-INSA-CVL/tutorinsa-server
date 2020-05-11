// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { User } from '../declarations'
import { BadRequest } from '@feathersjs/errors'
import mongoose from 'mongoose'

/**
 * Check if a value is a string and an objectId
 * @param value which will test by the regex
 * @returns boolean
 */
function checkObjectId(value: unknown): boolean {
  return typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)
}

/**
 * Check that the data format is correct in the Id field (fields containing ObjectId)
 * Warning: check not that the object exist in a db
 */
export default (options = {}): Hook => {
  return async (context: HookContext<User>) => {
    const { data } = context

    if (data) {
      const keys = Object.keys(data)
      const idRegex = new RegExp(/(id|ids)$/i)

      // Inspect the object
      keys.forEach((key: string) => {
        // Find Id fields
        if (idRegex.test(key)) {
          // Field is a string
          if (typeof data[key] === 'string') {
            const element = data[key]
            // If uncorrect
            if (!checkObjectId(element)) {
              throw new BadRequest(`${element} in ${key} is incorrect`)
            }
            // Field is an array
          } else if (Array.isArray(data[key])) {
            const elements = data[key] as string[]
            // Check each item, must be a string with the pattern
            elements.forEach((element) => {
              // If uncorrect
              if (!checkObjectId(element)) {
                throw new BadRequest(`${element} in ${key} is incorrect`)
              }
            })
            // Not an array or a string
          } else {
            const element = data[key]
            throw new BadRequest(`${element} in ${key} is incorrect`)
          }
        }
      })
    }
    return context
  }
}
