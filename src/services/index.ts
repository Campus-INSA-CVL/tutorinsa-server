import { Application } from '../declarations'
import users from './users/users.service'
import years from './years/years.service'
import subjects from './subjects/subjects.service'
import departments from './departments/departments.service'
import rooms from './rooms/rooms.service'
import posts from './posts/posts.service'
import calendars from './calendars/calendars.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(users)
  app.configure(years)
  app.configure(subjects)
  app.configure(departments)
  app.configure(rooms)
  app.configure(posts)
  app.configure(calendars)
}
