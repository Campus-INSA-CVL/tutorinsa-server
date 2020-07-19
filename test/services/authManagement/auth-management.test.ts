import { BadRequest } from '@feathersjs/errors'
import { Params, ServiceMethods } from '@feathersjs/feathers'
import app from '../../../src/app'
import { Email, User } from '../../../src/declarations'
import addDataToUser from '../../utils/addDataToUser'
import bcrypt from 'bcrypt'

const serviceName = 'authManagement'

const spyEmail = jest.spyOn(
  app.service('mailer') as ServiceMethods<Email>,
  'create'
)

describe(`'${serviceName}' service`, () => {
  it('registered the service', () => {
    const service = app.service(serviceName)
    expect(service).toBeTruthy()
  })

  describe('documentation', () => {
    it('should have a documentation', () => {
      const service = app.service(serviceName) as { docs: unknown }

      expect(service.docs).toBeDefined()
      expect(service.docs).toHaveProperty('description')
    })
  })

  describe('external CRUD', () => {
    let error: Error | null
    let result: User

    const params: Params = {}

    const dataUser: User = {
      lastName: 'fakeLastName',
      firstName: 'username',
      email: 'username@insa-cvl.fr',
      password: '$Azerty1',
      permissions: ['tuteur'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
      createdPostsIds: [],
    }
    let user: User

    beforeAll(async () => {
      // Delete all the data from the rooms collection
      await app.get('mongooseClient').model('users').find().deleteMany()

      try {
        await addDataToUser(dataUser)
        user = await app.service('users').create(dataUser)
      } catch (e) {
        // Error
      }

      params.user = user
    })

    beforeEach(() => {
      error = null
    })

    afterEach(() => {
      spyEmail.mockReset()
    })

    it('should send an email to new user', () => {
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: user.email })
      )
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: "TutorINSA: Confirmer l'inscription",
        })
      )
    })

    it('should validate a user and send an email', async () => {
      try {
        result = (await (app.service(serviceName) as ServiceMethods<
          object
        >).create({
          action: 'verifySignupLong',
          value: user.verifyToken,
        })) as User
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(result.isVerified).toBeTruthy()
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: user.email })
      )
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'TutorINSA: Inscription validée',
        })
      )
    })

    it('should send a reset token', async () => {
      try {
        result = (await (app.service(serviceName) as ServiceMethods<
          object
        >).create({
          action: 'sendResetPwd',
          value: {
            email: user.email,
          },
        })) as User
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: user.email })
      )
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'TutorINSA: Réinitialisation du mot de passe',
        })
      )
    })

    it('should reset password and send email', async () => {
      const token = user._id + '___' + 'this is the token'
      const hashToken = await bcrypt.hash(token, 10)
      const resetUser = await app
        .get('mongooseClient')
        .model('users')
        .findByIdAndUpdate(user._id, { resetToken: hashToken }, { new: true })

      try {
        result = (await (app.service(serviceName) as ServiceMethods<
          object
        >).create({
          action: 'resetPwdLong',
          value: {
            token,
            password: '$Azerty1',
          },
        })) as User
      } catch (e) {
        error = e
      }

      expect(error).toBeNull()
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: user.email })
      )
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'TutorINSA: Confirmation de modification du mot de passe',
        })
      )
    })

    it('should change password and send an email', async () => {
      try {
        result = (await (app.service(serviceName) as ServiceMethods<
          object
        >).create({
          action: 'passwordChange',
          value: {
            user: { email: user.email },
            oldPassword: '$Azerty1',
            password: '1ytrezA$',
          },
        })) as User
      } catch (e) {
        error = e
      }

      const patchedUser = (await app.service('users').get(user._id)) as User

      const verified = await bcrypt.compare('1ytrezA$', patchedUser.password)
      expect(verified).toBeTruthy()

      expect(error).toBeNull()
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: user.email })
      )
      expect(spyEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'TutorINSA: Confirmation de modification du mot de passe',
        })
      )
    })

    it('should not authorize invalid action', async () => {
      const data = { action: 'an action' }
      try {
        await (app.service(serviceName) as ServiceMethods<
          unknown
        >).create(data as unknown, { provider: 'rest' })
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe(`'${data.action}' is not an authorized action`)
    })
    it('should check password strength', async () => {
      const data = { action: 'passwordChange', value: { password: 'fake' } }
      try {
        await (app.service(serviceName) as ServiceMethods<
          unknown
        >).create(data as unknown, { provider: 'rest' })
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(BadRequest)
      expect(error.message).toBe('this password is not strong enough')
    })
  })
})
