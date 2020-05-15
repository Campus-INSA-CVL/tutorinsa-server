/* tslint:disable:no-empty-interface */
import { Application as ExpressFeathers } from '@feathersjs/express'
import { Id } from '@feathersjs/feathers'

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}
// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>

export interface Year {
  _id?: Id
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Subject {
  _id?: Id
  name: string
  createdAt?: string
  updatedAt?: string
}
export interface Department {
  _id?: Id
  name: string
  createdAt?: string
  updatedAt?: string
}

export type RoomCampus = 'blois' | 'bourges'

export type RoomDays =
  | 'lundi'
  | 'mardi'
  | 'mercredi'
  | 'jeudi'
  | 'vendredi'
  | 'samedi'
  | 'dimanche'

export interface Room {
  _id?: Id
  campus: RoomCampus
  name: string
  day: RoomDays
  startAt: string
  duration: number
  createdAt?: string
  updatedAt?: string

  [key: string]: string | number | RoomCampus | RoomDays | undefined | Id
}

export type UserPermission = 'eleve' | 'tuteur' | 'admin'
export interface User {
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

export type PostType = 'eleve' | 'tuteur'

export interface Post {
  _id?: Id
  comment: string
  type: PostType
  startAt: string
  duration: number
  studentsCapacity: number
  tutorsCapacity: number
  subjectId: string
  studentsIds: string[]
  tutorsIds: string[]
  roomId: string
  creatorId: string
  createdAt?: string
  updatedAt?: string

  [key: string]: string | string[] | number | PostType | undefined | Id
}
