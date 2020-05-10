import app from '../src/app'
import addDataToUser from './utils/addDataToUser'
import { User } from '../src/declarations'

describe('authentication', () => {
  it('registered the authentication service', () => {
    expect(app.service('authentication')).toBeTruthy()
  })

  describe('local strategy', () => {
    const userInfo: User = {
      lastName: 'authLastName',
      firstName: 'username',
      email: 'auth@insa-cvl.fr',
      password: '$Azerty1',
      permissions: ['eleve'],
      yearId: '',
      departmentId: '',
      favoriteSubjectsIds: [],
      difficultSubjectsIds: [],
    }

    beforeAll(async () => {
      await addDataToUser(userInfo)

      try {
        await app.service('users').create(userInfo)
      } catch (error) {
        // Do nothing, it just means the user already exists and can be tested
      }
    })

    it('authenticates user and creates accessToken', async () => {
      const { user, accessToken } = await app.service('authentication').create(
        {
          strategy: 'local',
          email: userInfo.email,
          password: userInfo.password,
        },
        {}
      )

      expect(accessToken).toBeTruthy()
      expect(user).toBeTruthy()
    }, 1000)
  })
})
