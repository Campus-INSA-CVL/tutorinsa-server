import app from '../../src/app'

describe("'subscription' service", () => {
  it('registered the service', () => {
    const service = app.service('subscription')
    expect(service).toBeTruthy()
  })
})
