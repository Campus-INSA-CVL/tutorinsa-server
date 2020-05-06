import { Application } from '../declarations'
import users from './users/users.service'
import years from './years/years.service'
import subjects from './subjects/subjects.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(users)
  app.configure(years)
  app.configure(subjects)
}
