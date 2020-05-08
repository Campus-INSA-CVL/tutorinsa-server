// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import validator from 'validator'
import { BadRequest } from '@feathersjs/errors'

export default (options = {}): Hook => {
  return async (context: HookContext<User | Year | Subject | Department>) => {
    const { path, data } = context

    if (data) {
      switch (path) {
        case 'users':
          break
        case 'years':
          if (!(data as Year).name) {
            throw new BadRequest('request must contain correct fields')
          }
          if (typeof (data as Year).name !== 'string') {
            throw new BadRequest('name must be a string')
          } else {
            let { name } = data as Year
            name = validator.trim(name)
            name = validator.escape(name)
            ;(data as Year).name = name
          }
          break
        case 'departments':
          break
        case 'subjects':
          break
        default:
          break
      }
    }

    return context
  }
}
