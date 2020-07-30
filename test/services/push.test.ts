import app from '../../src/app'

describe("'push' service", () => {
  it('registered the service', () => {
    const service = app.service('push')
    expect(service).toBeTruthy()
  })
})
