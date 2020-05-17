// calendar-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations'

export default function (app: Application) {
  const modelName = 'calendar'
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const schema = new Schema(
    {
      startAt: {
        type: Date,
        required: true,
      },
      roomId: {
        type: mongooseClient.Schema.Types.ObjectId,
        ref: 'rooms',
        required: true,
      },
      slots: [
        {
          postId: {
            type: mongooseClient.Schema.Types.ObjectId,
            ref: 'posts',
            required: true,
          },
          startAt: {
            type: Date,
            required: true,
          },
          occupied: {
            type: Boolean,
            required: true,
          },
        },
      ],
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
