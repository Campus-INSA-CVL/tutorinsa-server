import app from '../../src/app'
import { User, Year, Department, Subject } from '../../src/declarations'
import { Paginated } from '@feathersjs/feathers'

/**
 * Add a yearId, a departmentId, 1 favoriteSubjectsId and 1 difficultSubjectsIds to a user
 * @param user to which data must be added
 */
export default async function addDataToUser(user: User): Promise<void> {
  let results: any[] | Paginated<User>
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

  user.yearId = year._id.toString()
  user.departmentId = department._id.toString()
  user.favoriteSubjectsIds.push(subject._id.toString())
  user.difficultSubjectsIds.push(subject._id.toString())
}
