import app from '../../src/app'

describe("'rooms' service", () => {
  it('registered the service', () => {
    const service = app.service('rooms')
    expect(service).toBeTruthy()
  })
})
