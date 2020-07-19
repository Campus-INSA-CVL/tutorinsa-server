import { ServiceMethods } from '@feathersjs/feathers'
import pug from 'pug'
import path from 'path'
import notifier from '../../../src/services/auth-management/notifier'
import app from '../../../src/app'
import { Email, User, NotifierType } from '../../../src/declarations'

const spyEmail = jest.spyOn(
  app.service('mailer') as ServiceMethods<Email>,
  'create'
)

describe("'notifier' function", () => {
  let user: User
  let error: Error | null = null

  beforeEach(() => {
    user = {
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: '$Azerty1',
      permissions: ['eleve'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
      createdPostsIds: [],
      verifyToken: 'token',
      resetToken: 'token',
    }

    error = null
  })

  afterEach(() => {
    spyEmail.mockReset()
  })

  describe('authManagement', () => {
    it.each([
      ['resendVerifySignup', 'verify', "TutorINSA: Confirmer l'inscription"],
      ['verifySignup', '', 'TutorINSA: Inscription validée'],
      ['sendResetPwd', 'reset', 'TutorINSA: Réinitialisation du mot de passe'],
      [
        'resetPwd',
        '',
        'TutorINSA: Confirmation de modification du mot de passe',
      ],
      [
        'passwordChange',
        '',
        'TutorINSA: Confirmation de modification du mot de passe',
      ],
    ])('should send email, %s', async (action, type, subject) => {
      const options = {
        user,
        tokenLink: `${app.get('front_url')}/${type}?token=${
          user[type + 'Token']
        }`,
      }

      const html = pug.renderFile(
        path.join(
          __dirname,
          '..',
          '..',
          '..',
          '/src',
          '/services',
          '/mailer',
          '/template',
          `${action}.pug`
        ),
        options
      )

      const expectedEmail: Email = {
        from: 'fake@mail.com',
        to: user.email,
        subject,
        html,
      }

      try {
        await notifier(app).notifier(action as NotifierType, user)
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(spyEmail).toHaveBeenCalledTimes(1)
      expect(spyEmail).toHaveBeenCalledWith(expectedEmail)
    })
  })
})
