// posts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application, Post } from '../declarations'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import moment from '../utils/moment'

import { checkMinutes, checkDate, checkDuration } from './validation/validate'

export default function (app: Application) {
  const modelName = 'posts'
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const schema = new Schema(
    {
      comment: {
        type: String,
        required: true,
        maxlength: 440,
      },
      type: {
        type: String,
        required: true,
        enum: ['eleve', 'tuteur'],
      },
      startAt: {
        type: Date,
        required: true,
        validate: [checkMinutes, checkDate],
      },
      duration: {
        type: Number,
        required: true,
        validate: checkDuration,
      },
      studentsCapacity: {
        type: Number,
        required: true,
        min: 5,
        max: 20,
      },
      tutorsCapacity: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      subjectId: {
        type: mongooseClient.Schema.Types.ObjectId,
        ref: 'subjects',
        required: true,
      },
      studentsIds: [
        {
          type: mongooseClient.Schema.Types.ObjectId,
          ref: 'users',
          required: true,
          default: [],
        },
      ],
      tutorsIds: [
        {
          type: mongooseClient.Schema.Types.ObjectId,
          ref: 'users',
          required: true,
          default: [],
        },
      ],
      roomId: {
        type: mongooseClient.Schema.Types.ObjectId,
        ref: 'rooms',
        required: true,
      },
      creatorId: {
        type: mongooseClient.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )

  schema.virtual('endAt').get(function (this: Post) {
    return moment(this.startAt)
      .add(moment.duration(this.duration, 'minutes'))
      .toISOString()
  })

  schema.plugin(mongooseLeanVirtuals)

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, schema)
}
