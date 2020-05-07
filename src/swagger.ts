import swagger from 'feathers-swagger'
import app from './app'
import yml from './docs/utils/yamlLoader'

const specs: any = yml('app.doc.yml')

const options: swagger.SwaggerInitOptions = {
  openApiVersion: 3,
  uiIndex: true,
  docsPath: '/docs',
  docsJsonPath: '/docs/schema',
  specs,
}

export default swagger(options)
