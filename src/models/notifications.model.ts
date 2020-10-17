// notifications-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations'
import { Model, Mongoose } from 'mongoose'

const objSchema = {
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  image: {
    type: String,
  },
  icon: {
    type: String,
  },
  data: {
    type: Object,
  },
}

const objOptions = {
  timestamps: true,
}

export default function (app: Application): Model<any> {
  const modelName = 'notifications'
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
