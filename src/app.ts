import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'

import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'

import { Application } from './declarations'
import logger from './logger'
import middleware from './middleware'
import services from './services'
import appHooks from './app.hooks'
import channels from './channels'
import authentication from './authentication'
import mongoose from './mongoose'
import swagger from './swagger'
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers())

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(
  cors({
    origin: '*',
  })
)
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.get('public')))

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())

app.configure(mongoose)

// Configure the documentation
app.configure(swagger)

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
app.configure(authentication)
// Set up our services (see `services/index.js`)
app.configure(services)
// Set up event channels (see channels.js)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(
  express.errorHandler({
    logger,
    html: {
      403: path.join(__dirname, '..', 'public/403.html'),
      404: path.join(__dirname, '..', 'public/404.html'),
      405: path.join(__dirname, '..', 'public/405.html'),
      500: path.join(__dirname, '..', 'public/500.html'),
    },
  } as any)
)

app.hooks(appHooks)

export default app
