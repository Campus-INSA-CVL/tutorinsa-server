#!/usr/bin/env ts-node-script
/* tslint:disable:no-console */
console.log(
  'This script is used to populates some test data to your database. Specified database as argument (mongoDB URI) - e.g: mongodb://localhost:27017/database-test'
)

// Get arguments passed on command line
const userArgs = process.argv.slice(2)

if (!userArgs.length) {
  throw new Error('you must provide a mongo URI')
}

import async from 'async'
import mongoose from 'mongoose'
import moment from 'moment'

import * as Subjects from './src/models/subjects.model'
import * as Years from './src/models/years.model'
import * as Departments from './src/models/departments.model'
import * as Rooms from './src/models/rooms.model'
import * as Users from './src/models/users.model'
import * as Posts from './src/models/posts.model'
import * as Calendars from './src/models/calendars.model'

import {
  RoomCampus,
  RoomDays,
  UserPermission,
  Year,
  Department,
  Subject,
  Post,
  PostType,
  User,
  Room,
} from './src/declarations'
import { createSlots } from './src/services/calendars/calendars.functions'
/**
 * Connect to the database
 */
mongoose
  .connect(userArgs[0], {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

mongoose.Promise = global.Promise

/**
 * Create the Schema
 */
const { Schema } = mongoose

const SubjectSchema = new Schema(Subjects.objSchema, Subjects.objOptions)
const YearSchema = new Schema(Years.objSchema, Years.objOptions)
const DepartmentSchema = new Schema(
  Departments.objSchema,
  Departments.objOptions
)
const RoomSchema = new Schema(Rooms.objSchema, Rooms.objOptions)
const UserSchema = new Schema(Users.objSchema, Users.objOptions)
const PostSchema = new Schema(Posts.objSchema, Posts.objOptions)
const CalendarSchema = new Schema(Calendars.objSchema, Calendars.objOptions)

/**
 * Add model to mongoose
 */
const Subject = mongoose.model('subjects', SubjectSchema)
const Year = mongoose.model('years', YearSchema)
const Department = mongoose.model('departments', DepartmentSchema)
const Room = mongoose.model('rooms', RoomSchema)
const User = mongoose.model('users', UserSchema)
const Post = mongoose.model('posts', PostSchema)
const Calendar = mongoose.model('calendars', CalendarSchema)

/**
 * Store all the data
 */
const subjects: mongoose.Document[] = []
const years: mongoose.Document[] = []
const departments: mongoose.Document[] = []
const rooms: mongoose.Document[] = []
const users: mongoose.Document[] = []
const posts: mongoose.Document[] = []
const calendars: mongoose.Document[] = []

/**
 * Create a document
 */
function createSubject(
  name: string,
  cb: (e: Error | null, subject: mongoose.Document | null) => void
) {
  const subject = new Subject({ name })

  subject.save((err) => {
    if (err) {
      console.error(err)
      cb(err, null)
      return
    }
    // console.log('New Subject: ' + subject)
    subjects.push(subject)
    cb(null, subject)
  })
}
function createYear(
  name: string,
  cb: (e: Error | null, year: mongoose.Document | null) => void
) {
  const year = new Year({ name })

  year.save((err) => {
    if (err) {
      console.error(err)
      cb(err, null)
      return
    }
    // console.log('New Year: ' + year)
    years.push(year)
    cb(null, year)
  })
}
function createDepartment(
  name: string,
  cb: (e: Error | null, department: mongoose.Document | null) => void
) {
  const department = new Department({ name })

  department.save((err) => {
    if (err) {
      console.error(err)
      cb(err, null)
      return
    }
    // console.log('New Department: ' + department)
    departments.push(department)
    cb(null, department)
  })
}
function createRoom(
  campus: RoomCampus,
  name: string,
  day: RoomDays,
  startAt: string,
  duration: number,
  cb: (e: Error | null, department: mongoose.Document | null) => void
) {
  const room = new Room({ campus, name, day, startAt, duration })

  room.save((err) => {
    if (err) {
      console.error(err)
      cb(err, null)
      return
    }
    // console.log('New Room: ' + room)
    rooms.push(room)
    cb(null, room)
  })
}
function createUser(
  lastName: string,
  firstName: string,
  email: string,
  permissions: UserPermission[],
  year: mongoose.Document,
  department: mongoose.Document,
  favoriteSubjects: mongoose.Document[],
  difficultSubjects: mongoose.Document[],
  createdPostsIds: mongoose.Document[],
  cb: (e: Error | null, department: mongoose.Document | null) => void
) {
  const password =
    '$2a$10$MkiI931dI34dr6WSD0Eah.QYFW/Tl2fZXeLK8DVlSFiS1bp.U7R1G'
  const user = new User({
    lastName,
    firstName,
    email,
    password,
    permissions,
    yearId: year,
    departmentId: department,
    favoriteSubjectsIds: favoriteSubjects,
    difficultSubjectsIds: difficultSubjects,
    createdPostsIds,
  })

  user.save((err) => {
    if (err) {
      console.error(err)
      cb(err, null)
      return
    }
    // console.log('New User: ' + user)
    users.push(user)
    cb(null, user)
  })
}
async function createPost(
  comment: string,
  type: PostType,
  subject: mongoose.Document,
  creator: mongoose.Document | User,
  cb: (e: Error | null, department: mongoose.Document | null) => void,
  startAt?: string,
  duration?: number,
  studentsCapacity?: number,
  tutorsCapacity?: number,
  students?: mongoose.Document[],
  tutors?: mongoose.Document[],
  room?: mongoose.Document
) {
  let post: mongoose.Document
  if (type === 'eleve') {
    post = new Post({
      comment,
      type,
      subjectId: subject,
      creatorId: creator,
    })
  } else {
    post = new Post({
      comment,
      type,
      subjectId: subject,
      creatorId: creator,
      startAt,
      duration,
      studentsCapacity,
      tutorsCapacity,
      studentsIds: students,
      tutorsIds: tutors,
      roomId: room,
    })
  }

  await post.save((err) => {
    if (err) {
      console.error(err)
      cb(err, null)
      return
    }
    // console.log('New Post: ' + post)
    posts.push(post)
  })

  const user = await User.findOneAndUpdate(
    { _id: creator._id },
    { createdPostsIds: [...(creator as User).createdPostsIds, post._id] },
    { new: true },
    (e) => {
      if (e) {
        console.error(e)
        cb(e, null)
        return
      }
    }
  )

  users.forEach((u, index) => {
    if (u._id.toString() === user?._id.toString()) {
      // @ts-ignore
      users[index].createdPostsIds = user.createdPostsIds
    }
  })
  cb(null, post)
}
function createCalendar(
  room: mongoose.Document | Room,
  post: mongoose.Document | Post,
  cb: (e: Error | null, department: mongoose.Document | null) => void
) {
  const slots = createSlots(
    (post as Post).startAt as string,
    (post as Post).duration as number,
    (post as Post)._id
  )

  const calendar = new Calendar({
    startAt: (room as Room).startAt,
    duration: (room as Room).duration,
    roomId: (room as Room)._id,
    slots,
  })

  calendar.save((err) => {
    if (err) {
      console.error(err)
      cb(err, null)
      return
    }
    // console.log('New Calendar: ' + calendar)
    calendars.push(calendar)
    cb(null, calendar)
  })
}
async function createSubscription(
  post: mongoose.Document | Post,
  user: mongoose.Document | User,
  type: PostType,
  cb: (e: Error | null, value: unknown) => void
) {
  const userId = user._id.toString()
  const postId = post._id.toString()
  let data: object

  if (type === 'eleve') {
    data = {
      studentSubscriptionsIds: [
        // @ts-ignore
        ...(user as User).studentSubscriptionsIds,
        postId,
      ],
    }
  } else {
    data = {
      tutorSubscriptionsIds: [...(user as User).tutorSubscriptionsIds, postId],
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    data,
    { new: true },
    (e) => {
      if (e) {
        console.error(e)
        cb(e, null)
        return
      }
    }
  )

  users.forEach((u, index) => {
    if (u._id.toString() === user?._id.toString()) {
      // @ts-ignore
      users[index] = updatedUser
    }
  })

  if (type === 'eleve') {
    data = {
      studentsIds: [
        // @ts-ignore
        ...(post as Post).studentsIds,
        userId,
      ],
    }
  } else {
    data = {
      tutorsIds: [...(post as Post).tutorsIds, userId],
    }
  }

  const updatedPost = await Post.findByIdAndUpdate(
    { _id: postId },
    data,
    { new: true },
    (e) => {
      if (e) {
        console.error(e)
        cb(e, null)
        return
      }
    }
  )

  posts.forEach((p, index) => {
    if (p._id.toString() === post?._id.toString()) {
      // @ts-ignore
      posts[index] = updatedPost
    }
  })

  cb(null, null)
}

/**
 * Post all documents
 */
function postSubject(cb: () => void) {
  async.series(
    [
      (callback) => {
        createSubject('eps', callback)
      },
      (callback) => {
        createSubject('mathématiques', callback)
      },
      (callback) => {
        createSubject('lv2', callback)
      },
      (callback) => {
        createSubject('résistance des matériaux', callback)
      },
      (callback) => {
        createSubject('électronique analogique', callback)
      },
      (callback) => {
        createSubject('introduction au droit', callback)
      },
    ],
    cb
  )
}
function postYear(cb: () => void) {
  async.series(
    [
      (callback) => {
        createYear('1a', callback)
      },
      (callback) => {
        createYear('2a', callback)
      },
      (callback) => {
        createYear('3a', callback)
      },
      (callback) => {
        createYear('4a', callback)
      },
      (callback) => {
        createYear('5a', callback)
      },
    ],
    cb
  )
}
function postDepartment(cb: () => void) {
  async.series(
    [
      (callback) => {
        createDepartment('stpi', callback)
      },
      (callback) => {
        createDepartment('sti', callback)
      },
      (callback) => {
        createDepartment('gsi', callback)
      },
      (callback) => {
        createDepartment('enp', callback)
      },
      (callback) => {
        createDepartment('ere', callback)
      },
    ],
    cb
  )
}
function postRoom(cb: () => void) {
  async.series(
    [
      (callback) => {
        createRoom(
          'bourges',
          'e.101',
          'lundi',
          '1970-01-01T16:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'a.001',
          'mardi',
          '1970-01-01T18:00:00.000Z',
          180,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'd.1',
          'jeudi',
          '1970-01-01T14:00:00.000Z',
          150,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'a1.01',
          'vendredi',
          '1970-01-01T19:30:00.000Z',
          60,
          callback
        )
      },
    ],
    cb
  )
}
function postUser(cb: () => void) {
  async.series(
    [
      (callback) => {
        createUser(
          'Park',
          'Paul',
          'paul.park@insa-cvl.fr',
          ['eleve'],
          years[0],
          departments[0],
          [subjects[0], subjects[1]],
          [subjects[2]],
          [],
          callback
        )
      },
      (callback) => {
        createUser(
          'Simmons',
          'Amber',
          'amber.simmons@insa-cvl.fr',
          ['tuteur', 'eleve'],
          years[1],
          departments[1],
          [subjects[1], subjects[2]],
          [subjects[3], subjects[4]],
          [],
          callback
        )
      },
      (callback) => {
        createUser(
          'Hill',
          'Jake',
          'jake.hill@insa-cvl.fr',
          ['eleve'],
          years[2],
          departments[2],
          [subjects[2]],
          [subjects[4], subjects[5]],
          [],
          callback
        )
      },
      (callback) => {
        createUser(
          'admin',
          'admin',
          'admin.admin@insa-cvl.fr',
          ['admin'],
          years[3],
          departments[4],
          [subjects[2]],
          [subjects[4], subjects[5]],
          [],
          callback
        )
      },
      (callback) => {
        createUser(
          'Chester',
          'Wilson',
          'wilson.chester@insa-cvl.fr',
          ['tuteur'],
          years[1],
          departments[0],
          [subjects[2]],
          [subjects[4], subjects[3]],
          [],
          callback
        )
      },
    ],
    cb
  )
}
function postPost(cb: () => void) {
  async.series(
    [
      (callback) => {
        createPost(
          'so cool!',
          'tuteur',
          subjects[0],
          users[1],
          callback,
          moment
            .utc()
            .day('lundi')
            .weekday(7)
            .hour(18)
            .minutes(0)
            .seconds(0)
            .milliseconds(0)
            .toISOString(),
          60,
          15,
          2,
          [],
          [users[1]],
          rooms[0]
        )
      },
      (callback) => {
        createPost(
          'love to teach to other students!',
          'tuteur',
          subjects[2],
          users[1],
          callback,
          moment
            .utc()
            .day('jeudi')
            .weekday(7)
            .hour(14)
            .minutes(0)
            .seconds(0)
            .milliseconds(0)
            .toISOString(),
          90,
          20,
          5,
          [],
          [users[1]],
          rooms[3]
        )
      },
      (callback) => {
        createPost(
          "you're welcome to learn new things !",
          'eleve',
          subjects[4],
          users[1],
          callback
        )
      },
      (callback) => {
        createPost(
          'please I need help to undersantd this subject !',
          'eleve',
          subjects[5],
          users[2],
          callback
        )
      },
    ],
    cb
  )
}
function postCalendar(cb: () => void) {
  async.series(
    [
      (callback) => {
        createCalendar(rooms[0], posts[0], callback)
      },
      (callback) => {
        createCalendar(rooms[3], posts[1], callback)
      },
    ],
    cb
  )
}
function subscribe(cb: () => void) {
  async.series(
    [
      (callback) => {
        createSubscription(posts[0], users[0], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[0], users[2], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[1], users[2], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[0], users[4], 'tuteur', callback)
      },
    ],
    cb
  )
}

/**
 * Remove all the data from the database
 */
function removeAll(cb: () => void): void {
  async.series(
    [
      (callback) => {
        Subject.deleteMany({}).catch((err) => {
          callback(err, null)
          return
        })
        callback(null, 'All Subjects deleted')
      },
      (callback) => {
        Year.deleteMany({}).catch((err) => {
          callback(err, null)
          return
        })
        callback(null, 'All Years deleted')
      },
      (callback) => {
        Department.deleteMany({}).catch((err) => {
          callback(err, null)
          return
        })
        callback(null, 'All Departments deleted')
      },
      (callback) => {
        Room.deleteMany({}).catch((err) => {
          callback(err, null)
          return
        })
        callback(null, 'All Rooms deleted')
      },
      (callback) => {
        User.deleteMany({}).catch((err) => {
          callback(err, null)
          return
        })
        callback(null, 'All Users deleted')
      },
      (callback) => {
        Post.deleteMany({}).catch((err) => {
          callback(err, null)
          return
        })
        callback(null, 'All Posts deleted')
      },
      (callback) => {
        Calendar.deleteMany({}).catch((err) => {
          callback(err, null)
          return
        })
        callback(null, 'All Calendar deleted')
      },
    ],
    cb
  )
}

/**
 * Populate DB
 */
async.series(
  [
    removeAll,
    postSubject,
    postYear,
    postDepartment,
    postRoom,
    postUser,
    postPost,
    postCalendar,
    subscribe,
  ], // Optional callback
  (err, results) => {
    if (err) {
      console.error(err)
    } else {
      console.log(results)
    }
    // All done, disconnect from database
    mongoose.connection.close()
  }
)
