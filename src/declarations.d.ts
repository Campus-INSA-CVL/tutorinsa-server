/* tslint:disable:no-empty-interface */
import { Application as ExpressFeathers } from '@feathersjs/express'
import { Id } from '@feathersjs/feathers'

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}
// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>

declare global {
  interface Year {
    _id?: Id
    name: string
    createdAt?: string
    updatedAt?: string
  }

  interface Subject {
    _id?: Id
    name: string
    createdAt?: string
    updatedAt?: string
  }
  interface Department {
    _id?: Id
    name: string
    createdAt?: string
    updatedAt?: string
  }

  type UserPermission = 'eleve' | 'tuteur' | 'admin'
  interface User {
    _id?: Id
    lastName: string
    firstName: string
    email: string
    password: string
    permissions: UserPermission[]
    yearId: string
    departmentId: string
    favoriteSubjectsIds: string[]
    difficultSubjectsIds: string[]
    createdAt?: string
    updatedAt?: string

    [key: string]: string | string[] | UserPermission[] | undefined | Id
  }
}
