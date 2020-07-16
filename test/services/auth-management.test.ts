import app from '../../src/app'

describe("'authManagement' service", () => {
  it('registered the service', () => {
    const service = app.service('auth-management')
    expect(service).toBeTruthy()
  })
})
