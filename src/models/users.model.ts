// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations'
import { checkEmail } from './validation/validate'

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
        validate: checkEmail,
      },
      password: {
        type: String,
      },
      permissions: [
        {
          type: String,
          enum: ['eleve', 'tuteur', 'admin'],
          required: true,
        },
      ],
      yearId: {
        type: mongooseClient.Schema.Types.ObjectId,
        ref: 'years',
        required: true,
      },
      departmentId: {
        type: mongooseClient.Schema.Types.ObjectId,
        ref: 'departments',
        required: true,
      },
      favoriteSubjectsIds: [
        {
          type: mongooseClient.Schema.Types.ObjectId,
          ref: 'subjects',
          required: true,
        },
      ],
      difficultSubjectsIds: [
        {
          type: mongooseClient.Schema.Types.ObjectId,
          ref: 'subjects',
          required: true,
        },
      ],
      createdPostsIds: [
        {
          type: mongooseClient.Schema.Types.ObjectId,
          ref: 'posts',
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
