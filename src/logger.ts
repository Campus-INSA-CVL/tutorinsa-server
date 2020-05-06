import { createLogger, format, transports } from 'winston'
import path from 'path'

// Custom format
const logFormat = format.printf(
  (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
)

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({
      label: path.basename(process.mainModule!?.filename ?? 'test'),
    }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Format the metadata object
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
  ],
  exitOnError: false,
})

if (process.env.NODE_ENV !== 'test') {
  logger.transports.push(
    // Every logs
    new transports.File({
      filename: 'logs',
      format: format.combine(format.json()),
    }),
    // Error log
    new transports.File({
      level: 'error',
      filename: 'errors.log',
      format: format.combine(format.json()),
    })
  )
}

export default logger
