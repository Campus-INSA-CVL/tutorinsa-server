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
      let results: any[]
      // Create data to put in users
      results = (await app
        .service('years')
        .find({ query: { name: '3a' } })) as Year[]

      let year: Year = results[0]
      if (!year) {
        try {
          year = (await app.service('years').create({ name: '3A' })) as Year
        } catch (error) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }

      results = (await app
        .service('departments')
        .find({ query: { name: 'stpi' } })) as Department[]

      let department: Department = results[0]
      if (!department) {
        try {
          department = (await app
            .service('departments')
            .create({ name: 'STPI' })) as Department
        } catch (error) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }

      results = (await app
        .service('subjects')
        .find({ query: { name: 'eps' } })) as Subject[]

      let subject: Subject = results[0]
      if (!subject) {
        try {
          subject = (await app
            .service('subjects')
            .create({ name: 'EPS' })) as Subject
        } catch (error) {
          // Do nothing, it just means the user already exists and can be tested
        }
      }

      userInfo.yearId = year._id.toString()
      userInfo.departmentId = department._id.toString()
      userInfo.favoriteSubjectsIds.push(subject._id.toString())
      userInfo.difficultSubjectsIds.push(subject._id.toString())

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
    })
  })
})
