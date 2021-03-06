// Initializes the `mailer` service on path `/mailer`
import { ServiceAddons, ServiceMethods } from '@feathersjs/feathers'
import { Application, Email } from '../../declarations'
import hooks from './mailer.hooks'
// @ts-ignore
import Mailer from 'feathers-mailer'
import smtpTransport from 'nodemailer-smtp-transport'
import stubTransport from 'nodemailer-stub-transport'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    mailer: ServiceMethods<Email> & ServiceAddons<any> & { docs: object }
  }
}

let transport: unknown
if (process.env.NODE_ENV === 'test') {
  transport = stubTransport()
} else {
  transport = smtpTransport({
    service: 'gmail',
    // host: 'smtp.mailtrap.io',
    // port: 2525,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export default function (app: Application) {
  const docs = yml('mailer.doc.yml')
  // Initialize our service with any options it requires
  app.use('/mailer', Object.assign(Mailer(transport), { docs }))

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer')

  service.hooks(hooks)
}
