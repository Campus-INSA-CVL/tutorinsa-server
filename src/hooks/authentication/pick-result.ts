// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Paginated } from '@feathersjs/feathers'
import { permittedFieldsOf } from '@casl/ability/extra'
import { Ability } from '@casl/ability'
import pick from 'lodash.pick'

import { Services } from './ability'
import { GeneralError } from '@feathersjs/errors'

/**
 * Extrat correct fields from an array
 * @param {object[]} data
 * @param {string[]} fields
 * @returns {object[]} Data without unreadable fields and empty object
 */
function pickElements(data: object[], fields: string[]): object[] {
  let result: object[]
  result = data.map((element: object) => pick(element, fields))
  result.forEach((element, index) => {
    if (!Object.keys(element).length) {
      result.splice(index)
    }
  })
  return result
}

/**
 * Extract readable fields from result
 * @param {Paginated<object> | object[] | object} result
 * @param {Ability} ability
 * @param {HookContext['method']} method
 * @param {Services} path
 * @returns {Paginated<object> | object[] | object} new result
 */
function pickFromResult(
  result: Paginated<object> | object[] | object,
  ability: Ability,
  method: HookContext['method'],
  path: Services
): Paginated<object> | object[] | object {
  const fields = permittedFieldsOf(ability, method, path)
  if (!fields.length) {
    return result
  }
  let rawResult: Paginated<object> | object[] | object = {}
  if (method === 'find') {
    if ((result as Paginated<object>).data) {
      rawResult = result as Paginated<object>

      const data = pickElements((result as Paginated<object>).data, fields)

      ;(rawResult as Paginated<object>).data = data as object[]
      // ;(rawResult as Paginated<object>).total = (data as object[]).length
    } else if (Array.isArray(result)) {
      rawResult = pickElements(result, fields)
    } else {
      throw new GeneralError('the pattern of the result is uncorrect')
    }
  } else if (method === 'get') {
    rawResult = pick(result, fields)
  }
  return rawResult
}

/**
 * Extract readable fields
 */
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { result, method, params, path } = context
    const { ability } = params

    if (result) {
      context.result = pickFromResult(result, ability, method, path as Services)
    }

    return context
  }
}
