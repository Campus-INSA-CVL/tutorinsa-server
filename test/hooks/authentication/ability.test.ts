import defineAbilityFor from '../../../src/hooks/authentication/ability'
import app from '../../../src/app'
import {
  Post,
  Room,
  User,
  Year,
  Department,
  Subject,
} from '../../../src/declarations'
import createDate from '../../utils/createDate'
import moment from '../../../src/utils/moment'
import util from 'util'

import { Ability, subject as addSubject } from '@casl/ability'

describe("'ability' hook", () => {
  let room: Room
  let post: Post
  let user: User
  let year: Year
  let departement: Department
  let subject: Subject

  let ability: Ability

  beforeAll(async () => {
    year = {
      name: '3a',
    }

    departement = {
      name: 'gsi',
    }

    subject = {
      name: 'culture et communication',
    }

    user = {
      _id: '5ccaea940db44157d84e8c94',
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

    room = {
      campus: 'blois',
      name: 'E.106',
      day: 'lundi',
      startAt: 'Tue May 12 2020 20:00:00 GMT+0000',
      duration: 120,
    }

    post = {
      _id: '5ccaea940db44157d84e8c95',
      comment: 'hello there',
      type: 'tuteur',
      startAt: createDate(),
      duration: 60,
      studentsCapacity: 15,
      tutorsCapacity: 2,
      subjectId: '5ccaea940db44157d84e8c93',
      roomId: '',
      studentsIds: [],
      tutorsIds: [],
      creatorId: '5ccaea940db44157d84e8c93',
    }
  })

  describe("'subjects' service", () => {
    const name = 'subjects'
    describe('anonymous', () => {
      beforeAll(() => {
        ability = defineAbilityFor(undefined)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, subject))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, subject))).toBeFalsy()
        }
      )
    })
    describe('student', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['eleve'] } as User)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, subject))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, subject))).toBeFalsy()
        }
      )
    })
    describe('tutor', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['tuteur'] } as User)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, subject))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, subject))).toBeFalsy()
        }
      )
    })
    describe('admin', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['admin'] } as User)
      })

      it.each(['find', 'get', 'create', 'patch'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, subject))).toBeTruthy()
      })

      it.each(['update', 'remove'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, subject))).toBeFalsy()
      })
    })
  })

  describe("'departments' service", () => {
    const name = 'departments'
    describe('anonymous', () => {
      beforeAll(() => {
        ability = defineAbilityFor(undefined)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, departement))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, departement))).toBeFalsy()
        }
      )
    })
    describe('student', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['eleve'] } as User)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, departement))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, departement))).toBeFalsy()
        }
      )
    })
    describe('tutor', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['tuteur'] } as User)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, departement))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, departement))).toBeFalsy()
        }
      )
    })
    describe('admin', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['admin'] } as User)
      })

      it.each(['find', 'get', 'create', 'patch'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, departement))).toBeTruthy()
      })

      it.each(['update', 'remove'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, departement))).toBeFalsy()
      })
    })
  })

  describe("'years' service", () => {
    const name = 'years'
    describe('anonymous', () => {
      beforeAll(() => {
        ability = defineAbilityFor(undefined)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, year))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, year))).toBeFalsy()
        }
      )
    })
    describe('student', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['eleve'] } as User)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, year))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, year))).toBeFalsy()
        }
      )
    })
    describe('tutor', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['tuteur'] } as User)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, year))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, year))).toBeFalsy()
        }
      )
    })
    describe('admin', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['admin'] } as User)
      })

      it.each(['find', 'get', 'create', 'patch'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, year))).toBeTruthy()
      })

      it.each(['update', 'remove'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, year))).toBeFalsy()
      })
    })
  })

  describe("'posts' service", () => {
    const name = 'posts'
    describe('anonymous', () => {
      beforeAll(() => {
        ability = defineAbilityFor(undefined)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(
          ability.can(key, addSubject(name, { type: 'eleve' }))
        ).toBeTruthy()

        expect(
          ability.can(
            key,
            addSubject(name, {
              type: 'tuteur',
            })
          )
        ).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, post))).toBeFalsy()
        }
      )
    })
    describe('student', () => {
      beforeAll(() => {
        ability = defineAbilityFor({
          _id: user._id,
          permissions: ['eleve'],
        } as User)
      })

      it.each(['find', 'get', 'patch'])('should %s', (key) => {
        expect(
          ability.can(key, addSubject(name, { type: 'eleve' }))
        ).toBeTruthy()

        expect(
          ability.can(
            key,
            addSubject(name, {
              type: 'tuteur',
            })
          )
        ).toBeTruthy()
      })

      it('should create type eleve', () => {
        expect(
          ability.can(
            'create',
            addSubject(name, {
              type: 'tuteur',
            })
          )
        ).toBeFalsy()
        expect(
          ability.can(
            'create',
            addSubject(name, {
              type: 'eleve',
            })
          )
        ).toBeTruthy()
      })

      it.each(['update'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, post))).toBeFalsy()
      })

      it('should remove', () => {
        expect(
          ability.can('remove', addSubject(name, { creatorId: 'data' }))
        ).toBeFalsy()
        expect(
          ability.can('remove', addSubject(name, { creatorId: user._id }))
        ).toBeTruthy()
      })
    })
    describe('tutor', () => {
      beforeAll(() => {
        ability = defineAbilityFor({
          _id: user._id,
          permissions: ['tuteur'],
        } as User)
      })

      it.each(['find', 'get', 'patch'])('should %s', (key) => {
        expect(
          ability.can(key, addSubject(name, { type: 'eleve' }))
        ).toBeTruthy()

        expect(
          ability.can(
            key,
            addSubject(name, {
              type: 'tuteur',
            })
          )
        ).toBeTruthy()
      })

      it('should create type tuteur', () => {
        expect(
          ability.can(
            'create',
            addSubject(name, {
              type: 'eleve',
            })
          )
        ).toBeFalsy()
        expect(
          ability.can(
            'create',
            addSubject(name, {
              type: 'tuteur',
            })
          )
        ).toBeTruthy()
      })

      it.each(['update'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, post))).toBeFalsy()
      })

      it('should remove', () => {
        expect(
          ability.can('remove', addSubject(name, { creatorId: 'data' }))
        ).toBeFalsy()
        expect(
          ability.can('remove', addSubject(name, { creatorId: user._id }))
        ).toBeTruthy()
      })
    })
    describe('admin', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['admin'] } as User)
      })

      it.each(['find', 'get', 'patch'])('should %s', (key) => {
        expect(
          ability.can(
            key,
            addSubject(name, {
              startAt: moment.utc().weekday(-7).toISOString(),
            })
          )
        ).toBeTruthy()

        expect(
          ability.can(key, addSubject(name, { type: 'eleve' }))
        ).toBeTruthy()

        expect(
          ability.can(
            key,
            addSubject(name, {
              startAt: createDate(),
              type: 'tutor',
            })
          )
        ).toBeTruthy()
      })

      it('should create both type', () => {
        expect(
          ability.can(
            'create',
            addSubject(name, {
              type: 'tuteur',
            })
          )
        ).toBeTruthy()
        expect(
          ability.can(
            'create',
            addSubject(name, {
              type: 'eleve',
            })
          )
        ).toBeTruthy()
      })

      it.each(['update'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, post))).toBeFalsy()
      })

      it('should remove', () => {
        expect(ability.can('remove', addSubject(name, post))).toBeTruthy()
      })
    })
  })

  describe("'rooms' service", () => {
    const name = 'rooms'
    describe('anonymous', () => {
      beforeAll(() => {
        ability = defineAbilityFor(undefined)
      })

      it.each(['find', 'get', 'create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, room))).toBeFalsy()
        }
      )
    })
    describe('student', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['eleve'] } as User)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, room))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, room))).toBeFalsy()
        }
      )
    })
    describe('tutor', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['tuteur'] } as User)
      })

      it.each(['find', 'get'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, room))).toBeTruthy()
      })

      it.each(['create', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, room))).toBeFalsy()
        }
      )
    })
    describe('admin', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['admin'] } as User)
      })

      it.each(['find', 'get', 'create'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, room))).toBeTruthy()
      })

      it.each(['patch', 'update', 'remove'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, room))).toBeFalsy()
      })
    })
  })

  describe("'subscriptions' service", () => {
    const name = 'subscriptions'
    describe('anonymous', () => {
      beforeAll(() => {
        ability = defineAbilityFor(undefined)
      })

      it.each(['find', 'get', 'create', 'patch', 'update', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, {}))).toBeFalsy()
        }
      )
    })
    describe('student', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['eleve'] } as User)
      })

      it.each(['patch'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeTruthy()
      })

      it.each(['find', 'get', 'create', 'update', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, {}))).toBeFalsy()
        }
      )
    })
    describe('tutor', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['tuteur'] } as User)
      })

      it.each(['patch'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeTruthy()
      })

      it.each(['find', 'get', 'create', 'update', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, {}))).toBeFalsy()
        }
      )
    })
    describe('admin', () => {
      beforeAll(() => {
        ability = defineAbilityFor({ permissions: ['admin'] } as User)
      })

      it.each(['patch'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeTruthy()
      })

      it.each(['find', 'get', 'create', 'update', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, {}))).toBeFalsy()
        }
      )
    })
  })

  describe("'users' service", () => {
    const name = 'users'
    describe('anonymous', () => {
      beforeAll(() => {
        ability = defineAbilityFor(undefined)
      })

      it.each(['create'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeTruthy()
      })

      it.each(['find', 'get', 'update', 'patch', 'remove'])(
        'should not %s',
        (key) => {
          expect(ability.can(key, addSubject(name, {}))).toBeFalsy()
        }
      )
    })
    describe('student', () => {
      beforeAll(() => {
        ability = defineAbilityFor({
          _id: user._id,
          permissions: ['eleve'],
        } as User)
      })

      it.each(['find', 'create'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeTruthy()
      })

      it('should get', () => {
        expect(
          ability.can('get', addSubject(name, { _id: user._id }))
        ).toBeTruthy()
        expect(
          ability.can('get', addSubject(name, { _id: 'data' }))
        ).toBeFalsy()
      })

      it('should patch', () => {
        expect(
          ability.can('patch', addSubject(name, { _id: user._id }))
        ).toBeTruthy()
        expect(
          ability.can('patch', addSubject(name, { _id: 'data' }))
        ).toBeFalsy()
      })

      it('should remove', () => {
        expect(
          ability.can('remove', addSubject(name, { _id: user._id }))
        ).toBeTruthy()
        expect(
          ability.can('remove', addSubject(name, { _id: 'data' }))
        ).toBeFalsy()
      })

      it.each(['update'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeFalsy()
      })
    })
    describe('tutor', () => {
      beforeAll(() => {
        ability = defineAbilityFor({
          _id: user._id,
          permissions: ['tuteur'],
        } as User)
      })

      it.each(['find', 'create'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeTruthy()
      })

      it('should get', () => {
        expect(
          ability.can('get', addSubject(name, { _id: user._id }))
        ).toBeTruthy()
        expect(
          ability.can('get', addSubject(name, { _id: 'data' }))
        ).toBeFalsy()
      })

      it('should patch', () => {
        expect(
          ability.can('patch', addSubject(name, { _id: user._id }))
        ).toBeTruthy()
        expect(
          ability.can('patch', addSubject(name, { _id: 'data' }))
        ).toBeFalsy()
      })

      it('should remove', () => {
        expect(
          ability.can('remove', addSubject(name, { _id: user._id }))
        ).toBeTruthy()
        expect(
          ability.can('remove', addSubject(name, { _id: 'data' }))
        ).toBeFalsy()
      })

      it.each(['update'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeFalsy()
      })
    })
    describe('admin', () => {
      beforeAll(() => {
        ability = defineAbilityFor({
          _id: user._id,
          permissions: ['admin'],
        } as User)
      })

      it.each(['find', 'create', 'patch', 'remove'])('should %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeTruthy()
      })

      it('should get', () => {
        expect(
          ability.can('get', addSubject(name, { _id: user._id }))
        ).toBeTruthy()
        expect(
          ability.can('get', addSubject(name, { _id: 'data' }))
        ).toBeFalsy()
      })

      it.each(['update'])('should not %s', (key) => {
        expect(ability.can(key, addSubject(name, {}))).toBeFalsy()
      })
    })
  })
})
