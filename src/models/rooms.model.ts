// rooms-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application, Room } from '../declarations'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import moment from '../utils/moment'

// import /* checkMinutes, checkDuration */ './validation/validate'

const objSchema = {
  campus: {
    type: String,
    required: true,
    lowercase: true,
    enum: ['blois', 'bourges'],
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
    enum: moment.weekdays(),
  },
  startAt: {
    type: Date,
    required: true,
    // validate: checkMinutes,
  },
  duration: {
    type: Number,
    required: true,
    min: 30,
    // validate: checkDuration,
  },
}

const objOptions = {
  timestamps: true,
  id: false,
}

export default function (app: Application) {
  const modelName = 'rooms'
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const schema = new Schema(objSchema, objOptions)

  /**
   * Set startAt to a 1970'date
   */
  schema.pre('save', function (this: Room, next: () => void) {
    const date = moment.utc(this.startAt)
    this.startAt = moment
      .utc(0)
      .hours(date.hours())
      .minutes(date.minutes())
      .toISOString()

    this.startAt = date.toISOString()

    next()
  })

  /**
   * Add a endAt field
   */
  schema.virtual('endAt').get(function (this: Room) {
    return moment(this.startAt)
      .add(moment.duration(this.duration, 'minutes'))
      .toISOString()
  })

  schema.plugin(mongooseLeanVirtuals)

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  /* istanbul ignore if */
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, schema)
}

export { objSchema, objOptions }
