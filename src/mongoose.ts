import mongoose from 'mongoose'
import { Application } from './declarations'
import logger from './logger'

export default function (app: Application) {
  mongoose
    .connect(app.get('mongodb'), {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      /* istanbul ignore next */
      logger.error(err)
      /* istanbul ignore next */
      process.exit(1)
    })

  mongoose.Promise = global.Promise

  app.set('mongooseClient', mongoose)
}
