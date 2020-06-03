// posts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application, Post } from '../declarations'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import moment from '../utils/moment'
import mongoose from 'mongoose'

import { checkMinutes, checkDate, checkDuration } from './validation/validate'

const objSchema = {
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
    validate: [checkMinutes, checkDate],
  },
  duration: {
    type: Number,
    validate: checkDuration,
  },
  studentsCapacity: {
    type: Number,
    min: 5,
    max: 20,
  },
  tutorsCapacity: {
    type: Number,
    min: 1,
    max: 5,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subjects',
    required: true,
  },
  studentsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
  tutorsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rooms',
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
}
const objOptions = {
  timestamps: true,
  id: false,
}

export default function (app: Application) {
  const modelName = 'posts'
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const schema = new Schema(objSchema, objOptions)

  /**
   * Add default value before saving the post
   */
  schema.pre('save', function (this: Post, next: () => void) {
    if (this.type === 'tuteur') {
      this.studentsIds = []
    }

    next()
  })

  /**
   * Add the end of the post
   */
  schema.virtual('endAt').get(function (this: Post) {
    if (this.type === 'tuteur') {
      return moment(this.startAt)
        .add(moment.duration(this.duration, 'minutes'))
        .toISOString()
    } else {
      return undefined
    }
  })
  /**
   * Tell if the post if full for the student
   */
  schema.virtual('fullStudents').get(function (this: Post) {
    return this.studentsIds?.length === this.studentsCapacity
  })
  /**
   * Tell if the post if full for the tutor
   */
  schema.virtual('fullTutors').get(function (this: Post) {
    return this.tutorsIds?.length === this.tutorsCapacity
  })

  schema.plugin(mongooseLeanVirtuals)

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, schema)
}

export { objSchema, objOptions }
