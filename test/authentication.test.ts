import app from '../src/app'

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
      // Create data to put in users
      const year = (await app.service('years').create({ name: '3A' })) as Year
      const department = (await app
        .service('departments')
        .create({ name: 'STPI' })) as Department
      const subject = (await app
        .service('subjects')
        .create({ name: 'EPS' })) as Subject

      userInfo.yearId = year._id as string
      userInfo.departmentId = department._id as string
      userInfo.favoriteSubjectsIds.push(subject._id as string)
      userInfo.difficultSubjectsIds.push(subject._id as string)

      try {
        await app.service('users').create(userInfo)
      } catch (error) {
        // Do nothing, it just means the user already exists and can be tested
      }
    })

    afterAll(async () => {
      await app.get('mongooseClient').model('users').find().deleteMany()
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
    })
  })
})
