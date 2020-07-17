import path from 'path'
import { errors } from '@feathersjs/errors'
import pug from 'pug'
import { Application, User, Email } from '../../declarations'

type NotifierTypes =
  | 'resendVerifySignup'
  | 'verifySignup'
  | 'sendResetPwd'
  | 'resetPwd'
  | 'passwordChange'
  | 'identityChange'

export default function (app: Application) {
  function getLink(type: string, hash: string): string {
    let url: string
    if (process.env.NODE_ENV === 'production') {
      url = `${app.get('host')}/${type}?token=${hash}`
    } else {
      url = `http://${app.get('host')}:${app.get('port')}/${type}?token=${hash}`
    }

    return url
  }

  async function sendEmail(email: Email) {
    try {
      const result = await app.service('mailer').create(email)
      // console.log(result)
    } catch (err) {
      // tslint:disable-next-line
      console.log('error sending email', errors)
    }
  }

  let html
  return {
    notifier(type: NotifierTypes, user: User, notifierOptions?: any) {
      let tokenLink: string
      let email: Email
      switch (type) {
        case 'resendVerifySignup': // Sending the user the verification email
          tokenLink = getLink('verify', user.verifyToken as string)

          html = pug.renderFile(
            path.join(
              __dirname,
              '..',
              '/mailer',
              '/template',
              'resendVerifySignup.pug'
            ),
            { user, tokenLink }
          )

          email = {
            from: process.env.STMP_EMAIL as string,
            to: user.email,
            subject: "TutorINSA: Confirmer l'insacription",
            html,
          }
          return sendEmail(email)
          break

        case 'verifySignup': // Confirming verification
          html = pug.renderFile(
            path.join(
              __dirname,
              '..',
              '/mailer',
              '/template',
              'verifySignup.pug'
            ),
            { user }
          )

          email = {
            from: process.env.STMP_EMAIL as string,
            to: user.email,
            subject: 'TutorINSA: Inscription validée',
            html,
          }
          return sendEmail(email)
          break

        case 'sendResetPwd':
          tokenLink = getLink('reset', user.resetToken as string)

          html = pug.renderFile(
            path.join(
              __dirname,
              '..',
              '/mailer',
              '/template',
              'sendResetPwd.pug'
            ),
            { user, tokenLink }
          )

          email = {
            from: process.env.STMP_EMAIL as string,
            to: user.email,
            subject: 'TutorINSA: Réinitialisation du mot de passe',
            html,
          }
          return sendEmail(email)
          break

        case 'resetPwd':
          // tokenLink = getLink('reset', user.resetToken as string)
          html = pug.renderFile(
            path.join(__dirname, '..', '/mailer', '/template', 'resetPwd.pug'),
            { user }
          )

          email = {
            from: process.env.STMP_EMAIL as string,
            to: user.email,
            subject: 'TutorINSA: Confirmation de modification du mot de passe',
            html,
          }
          return sendEmail(email)
          break

        case 'passwordChange':
          html = pug.renderFile(
            path.join(
              __dirname,
              '..',
              '/mailer',
              '/template',
              'passwordChange.pug'
            ),
            { user }
          )

          email = {
            from: process.env.STMP_EMAIL as string,
            to: user.email,
            subject: 'TutorINSA: Confirmation de modification du mot de passe',
            html,
          }
          return sendEmail(email)
          break

        // case 'identityChange':
        //   tokenLink = getLink('verifyChanges', user.verifyToken as string)
        //   email = {} as Email
        //   return sendEmail(email)
        //   break

        default:
          break
      }
    },
  }
}
