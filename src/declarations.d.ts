/* tslint:disable:no-empty-interface */
import { Application as ExpressFeathers } from '@feathersjs/express'

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}
// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>

declare global {
  type UserPermission = 'eleve' | 'tuteur' | 'admin'
  interface User {
    _id?: string
    lastName: string
    firstName: string
    email: string
    password: string
    permissions: UserPermission[]
    createdAt?: string
    updatedAt?: string
  }

  interface Year {
    _id?: string
    name: string
    createdAt?: string
    updatedAt?: string
  }

  interface Subject {
    _id?: string
    name: string
    createdAt?: string
    updatedAt?: string
  }
  interface Department {
    _id?: string
    name: string
    createdAt?: string
    updatedAt?: string
  }
}
