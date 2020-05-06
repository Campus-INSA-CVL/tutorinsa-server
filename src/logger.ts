import { createLogger, format, transports } from 'winston'
import path from 'path'

// Custom format
const logFormat = format.printf(
  (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
)

// Options for the logger
const options: {
  level: string
  format: any
  transports: (
    | transports.ConsoleTransportInstance
    | transports.FileTransportInstance
  )[]
  exitOnError: boolean
} = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({
      label: path.basename(process.mainModule!?.filename ?? 'test'),
    }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [],
  exitOnError: false,
}

// Add transports depending of the env
if (process.env.NODE_ENV === 'test') {
  const consoleLogs = new transports.Console({
    format: format.simple(),
  })

  options.transports.push(consoleLogs)
}

if (process.env.NODE_ENV === 'development') {
  const consoleLogs = new transports.Console({
    format: format.combine(format.colorize(), logFormat),
  })

  options.transports.push(consoleLogs)
}

if (process.env.NODE_ENV === 'production') {
  const logs = new transports.File({
    filename: 'logs',
    format: format.combine(format.json()),
  })
  const errorslog = new transports.File({
    level: 'error',
    filename: 'errors.log',
    format: format.combine(format.json()),
  })

  options.transports.push(logs)
  options.transports.push(errorslog)
}

// Create logger
const logger = createLogger(options)

export default logger
