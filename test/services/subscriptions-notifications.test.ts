import app from '../../src/app'

describe("'subscriptionsNotifications' service", () => {
  it('registered the service', () => {
    const service = app.service('subscriptions-notifications')
    expect(service).toBeTruthy()
  })
})
