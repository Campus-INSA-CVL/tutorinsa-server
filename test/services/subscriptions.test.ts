import app from '../../src/app'

describe("'subscriptions' service", () => {
  it('registered the service', () => {
    const service = app.service('subscriptions')
    expect(service).toBeTruthy()
  })
})
