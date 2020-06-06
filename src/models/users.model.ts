// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations'
import { checkEmail } from './validation/validate'
import mongoose from 'mongoose'

const objSchema = {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'years',
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'departments',
    required: true,
  },
  favoriteSubjectsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subjects',
      required: true,
    },
  ],
  difficultSubjectsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subjects',
      required: true,
    },
  ],
  createdPostsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
      default: [],
    },
  ],
  studentSubscriptionsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
  tutorSubscriptionsIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
}

const objOptions = {
  timestamps: true,
}

export default function (app: Application) {
  const modelName = 'users'
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient

  const schema = new Schema(objSchema, objOptions)

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  /* istanbul ignore if */
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, schema)
}

export { objSchema, objOptions }
