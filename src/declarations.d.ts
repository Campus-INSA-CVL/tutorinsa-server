/* tslint:disable:no-empty-interface */
import { Application as ExpressFeathers } from '@feathersjs/express'
import { Id } from '@feathersjs/feathers'

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}
// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>

export interface CheckDataOptions<T> {
  fields: (keyof T)[]
  arrayFields?: (keyof T)[]
  numberFields?: (keyof T)[]
  dateFields?: (keyof T)[]
  unwantedFields?: (keyof T)[]
}

export interface CheckPermissionsOptions {
  permissions: UserPermission[]
  admin: UserPermission
  default: UserPermission
}

export interface YearCore {
  _id?: Id
  name: string
  createdAt?: string
  updatedAt?: string
}
export type Year = YearCore & {
  [key: string]: Id | string | undefined
}

export interface SubjectCore {
  _id?: Id
  name: string
  createdAt?: string
  updatedAt?: string
}
export type Subject = SubjectCore & {
  [key: string]: Id | string | undefined
}
export interface DepartmentCore {
  _id?: Id
  name: string
  createdAt?: string
  updatedAt?: string
}
export type Department = DepartmentCore & {
  [key: string]: Id | string | undefined
}

export type Campus = 'blois' | 'bourges'

export type RoomDays =
  | 'lundi'
  | 'mardi'
  | 'mercredi'
  | 'jeudi'
  | 'vendredi'
  | 'samedi'
  | 'dimanche'

export interface RoomCore {
  _id?: Id
  campus: Campus
  name: string
  day: RoomDays
  startAt: string
  duration: number

  endAt?: string

  createdAt?: string
  updatedAt?: string
}

export type Room = RoomCore & {
  [key: string]: string | number | Campus | RoomDays | undefined | Id
}

export type UserPermission = 'eleve' | 'tuteur' | 'admin'
export interface UserCore {
  _id?: Id
  lastName: string
  firstName: string
  email: string
  password: string
  permissions: UserPermission[]
  yearId: Id
  departmentId: Id
  favoriteSubjectsIds: Id[]
  difficultSubjectsIds: Id[]
  createdPostsIds?: Id[]
  studentSubscriptionsIds?: Id[]
  tutorSubscriptionsIds?: Id[]
  appTheme?: string
  createdAt?: string
  updatedAt?: string

  year?: Year
  department?: Department
  favoriteSubjects?: Subject[]
  difficultSubjects?: Subject[]
}

export type User = UserCore & {
  [key: string]:
    | string
    | string[]
    | UserPermission[]
    | undefined
    | Id
    | Id[]
    | Year
    | Department
    | Subject[]
}

export type PostType = 'eleve' | 'tuteur'

export interface PostCore {
  _id?: Id
  comment: string
  type: PostType
  startAt?: string
  duration?: number
  campus?: Campus
  studentsCapacity?: number
  tutorsCapacity?: number
  subjectId: Id
  studentsIds?: Id[]
  tutorsIds?: Id[]
  roomId?: Id
  creatorId?: Id
  createdAt?: string
  updatedAt?: string

  endAt?: string
  fullStudents?: string
  fullTutors?: string

  subject?: Subject
  room?: Room
  creator?: User
  students?: User[]
  tutors?: User[]
}

export type Post = PostCore & {
  [key: string]:
    | string
    | string[]
    | number
    | PostType
    | undefined
    | Id
    | Id[]
    | Subject
    | Room
}

export interface SlotCore {
  postId: Id
  startAt: string
  occupied: boolean

  post?: Post
}

export type Slot = SlotCore & {
  [key: string]: string | undefined | Id | boolean | Post
}

export type SubscriptionType = 'subscribe' | 'unsubscribe'

export interface SubscriptionCore {
  type: SubscriptionType
  as: PostType
}

export type Subscription = SubscriptionCore
