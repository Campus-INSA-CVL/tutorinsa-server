import logger from './logger'
import util from 'util'
import app from './app'

const port = app.get('port')
const server = app.listen(port)

process.on('unhandledRejection', (reason, p) =>
  logger.error(
    `Unhandled Rejection at: Promise ${util.inspect(
      p,
      false,
      10,
      true
    )} ${util.inspect(reason, false, 10, true)}`
  )
)

server.on('listening', () =>
  logger.info(`API TutorINSA started on http://${app.get('host')}:${port}`, {
    type: 'start',
  })
)
