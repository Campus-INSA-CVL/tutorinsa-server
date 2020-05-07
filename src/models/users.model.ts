// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations'

export default function (app: Application) {
  const modelName = 'users'
  const mongooseClient = app.get('mongooseClient')
  const schema = new mongooseClient.Schema(
    {
      lastName: { type: String, required: true, lowercase: true },
      firstName: { type: String, required: true, lowercase: true },
      email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: {
          validator: (v: string) => {
            const regex = new RegExp(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@insa-cvl\.fr$/
            )
            return regex.test(v)
          },
          message: (props: any) =>
            `${props.value} n'est pas une adresse mail insa valide`,
        },
      },
      password: { type: String },
    },
    {
      timestamps: true,
    }
  )

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, schema)
}
