// Initializes the `mailer` service on path `/mailer`
import { ServiceAddons, ServiceMethods } from '@feathersjs/feathers'
import { Application, Email } from '../../declarations'
import hooks from './mailer.hooks'
// @ts-ignore
import Mailer from 'feathers-mailer'
import stmpTransport from 'nodemailer-smtp-transport'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    mailer: ServiceMethods<Email> & ServiceAddons<any>
  }
}

export default function (app: Application) {
  // Initialize our service with any options it requires
  app.use(
    '/mailer',
    Mailer(
      stmpTransport({
        service: 'gmail',
        // host: 'smtp.mailtrap.io',
        // port: 2525,
        auth: {
          user: process.env.STMP_EMAIL,
          pass: process.env.STMP_PASSWORD,
        },
      })
    )
  )

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer')

  service.hooks(hooks)
}
