import app from '../../src/app'

describe("'notifications' service", () => {
  it('registered the service', () => {
    const service = app.service('notifications')
    expect(service).toBeTruthy()
  })
})
