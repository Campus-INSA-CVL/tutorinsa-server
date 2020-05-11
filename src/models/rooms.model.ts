// rooms-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations'

export default function (app: Application) {
  const modelName = 'rooms'
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const schema = new Schema(
    {
      campus: {
        type: String,
        required: true,
        lowercase: true,
      },
      name: {
        type: String,
        required: true,
        lowercase: true,
      },
      day: {
        type: String,
        lowarcase: true,
        required: true,
      },
      startAt: {
        type: Date,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
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
