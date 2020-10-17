// subscriptionsNotifications-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations'
import mongoose, { Model, Mongoose } from 'mongoose'

const objSchema = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
}

const objOptions = {
  timestamps: true,
}

export default function (app: Application): Model<any> {
  const modelName = 'subscriptionsNotifications'
  const mongooseClient: Mongoose = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const schema = new Schema(objSchema, objOptions)

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    ;(mongooseClient as any).deleteModel(modelName)
  }
  return mongooseClient.model<any>(modelName, schema)
}
