import checkDate from '../../../../src/hooks/check/check-room/check-date'
import { HookContext, Application, Service } from '@feathersjs/feathers'
import { Room } from '../../../../src/declarations'

describe("'check-date' hook", () => {
  let context: HookContext<Room>
  let error: Error | null = null
  let result: HookContext<Room>

  beforeEach(() => {
    context = {
      app: {} as Application,
      service: {} as Service<Room>,
      method: 'create',
      params: {},
      path: '',
      type: 'before',
    }
    result = null
    error = null
  })

  it.todo('nothing should append with correct data')

  it.todo('should throw an error because of incorrect field %s')
})
