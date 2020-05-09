// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import validator from 'validator'
import { BadRequest } from '@feathersjs/errors'

/**
 * Validate and sanitizefata from the hook context (able to manage many services)
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
              // Check the type of the field
              if (
                typeof (data as User).lastName !== 'string' ||
                typeof (data as User).firstName !== 'string' ||
                typeof (data as User).email !== 'string' ||
                typeof (data as User).password !== 'string' ||
                !Array.isArray((data as User).permissions) ||
                typeof (data as User).yearId !== 'string' ||
                typeof (data as User).departmentId !== 'string' ||
                !Array.isArray((data as User).favoriteSubjectsIds) ||
                !Array.isArray((data as User).difficultSubjectsIds)
              ) {
                throw new BadRequest('type of data are incorrect')
              }
              // Password is test after
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
            // Trim and sanitize
            let { name } = data as Year
            name = validator.trim(name)
            name = validator.escape(name)
            ;(data as Year).name = name
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
            // Trim and sanitize
            let { name } = data as Department
            name = validator.trim(name)
            name = validator.escape(name)
            ;(data as Department).name = name
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
            let { name } = data as Subject
            name = validator.trim(name)
            name = validator.escape(name)
            ;(data as Subject).name = name
          }
          break
        default:
          break
      }
    }

    return context
  }
}
