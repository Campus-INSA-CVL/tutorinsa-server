import { Forbidden } from '@feathersjs/errors'
import { ServiceAddons, ServiceMethods } from '@feathersjs/feathers'
import app from '../../src/app'
import { Email } from '../../src/declarations'

const serviceName = 'mailer'

describe(`${serviceName} service`, () => {
  it('registered the service', () => {
    const service = app.service(serviceName)
    expect(service).toBeTruthy()
  })

  describe('documentation', () => {
    it('should have a documentation', () => {
      const service = app.service(serviceName) as ServiceMethods<Email>

      expect(service.docs).toBeDefined()
      expect(service.docs).toHaveProperty('description')
    })
  })

  describe('internal CRUD', () => {
    const email: Email = {
      from: 'fake@fake.mail.com',
      to: 'fake@fake.mail.com',
      subject: "yep, I'm the subject",
      html: 'hello',
    }

    it('should send an email', async () => {
      let error: Error | null = null
      let result: { envelope: unknown }
      try {
        result = ((await (app.service('mailer') as ServiceMethods<Email> &
          ServiceAddons<any> & { docs: object }).create(email)) as unknown) as {
          envelope: unknown
        }
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result).toHaveProperty('envelope')
      expect(result.envelope).toHaveProperty('from', email.from)
      expect(result.envelope).toHaveProperty('to', [email.to])
      expect(result).toHaveProperty('messageId')
      expect(result).toHaveProperty('response')
    })
  })

  describe('external CRUD', () => {
    it('should not create (disallow)', async () => {
      let error: Error | null = null
      try {
        await (app.service(serviceName) as ServiceMethods<Email>).create(
          {},
          { provider: 'rest' }
        )
      } catch (e) {
        error = e
      }
      expect(error).toBeInstanceOf(Forbidden)
    })
  })
})
