// Initializes the `mailer` service on path `/mailer`
import { ServiceAddons, ServiceMethods } from '@feathersjs/feathers'
import { Application, Email } from '../../declarations'
import hooks from './mailer.hooks'
// @ts-ignore
import Mailer from 'feathers-mailer'
import smtpTransport from 'nodemailer-smtp-transport'

import yml from '../../docs/utils/yamlLoader'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    mailer: ServiceMethods<Email> & ServiceAddons<any> & { docs: object }
  }
}

export default function (app: Application) {
  const docs = yml('mailer.doc.yml')
  // Initialize our service with any options it requires
  app.use(
    '/mailer',
    Object.assign(
      Mailer(
        smtpTransport({
          service: 'gmail',
          // host: 'smtp.mailtrap.io',
          // port: 2525,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        })
      ),
      { docs }
    )
  )

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer')

  service.hooks(hooks)
}
