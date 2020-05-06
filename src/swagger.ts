import swagger from 'feathers-swagger'
import app from './app'
import yml from './docs/utils/yamlLoader'
// import departmentsModel from'./models/departments.model'
// import postsModel from'./models/posts.model'
// import subjectsModel from'./models/subjects.model'
// import usersModel from'./models/users.model'
import yearsModel from './models/years.model'
// import roomsModel from'./models/rooms.model'
// import calendarModel from'./models/calendar.model'

const specs: any = yml('app.doc.yml')

specs.components.schemas = Object.assign(specs.components.schemas, {
  // department: departmentsModel(app).jsonSchema(),
  // year: yearsModel(app).jsonSchema(),
  // subject: subjectsModel(app).jsonSchema(),
  // post: postsModel(app).jsonSchema(),
  // user: usersModel(app).jsonSchema(),
  // room: roomsModel(app).jsonSchema(),
  // calendar: calendarModel(app).jsonSchema(),
})

const options: swagger.SwaggerInitOptions = {
  openApiVersion: 3,
  uiIndex: true,
  docsPath: '/docs',
  docsJsonPath: '/docs/schema',
  specs,
}

export default swagger(options)
