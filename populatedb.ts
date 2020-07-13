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
import mongoose, { Mongoose } from 'mongoose'
import moment from 'moment'

import * as Subjects from './src/models/subjects.model'
import * as Years from './src/models/years.model'
import * as Departments from './src/models/departments.model'
import * as Rooms from './src/models/rooms.model'
import * as Users from './src/models/users.model'
import * as Posts from './src/models/posts.model'

import {
  RoomDays,
  UserPermission,
  Year,
  Department,
  Subject,
  Post,
  PostType,
  User,
  Room,
  Campus,
} from './src/declarations'

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

/**
 * Add model to mongoose
 */
const Subject = mongoose.model('subjects', SubjectSchema)
const Year = mongoose.model('years', YearSchema)
const Department = mongoose.model('departments', DepartmentSchema)
const Room = mongoose.model('rooms', RoomSchema)
const User = mongoose.model('users', UserSchema)
const Post = mongoose.model('posts', PostSchema)

/**
 * Store all the data
 */
const subjects: mongoose.Document[] = []
const years: mongoose.Document[] = []
const departments: mongoose.Document[] = []
const rooms: mongoose.Document[] = []
const users: mongoose.Document[] = []
const posts: mongoose.Document[] = []

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
  campus: Campus,
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
  permissions: UserPermission[],
  year: mongoose.Document,
  department: mongoose.Document,
  favoriteSubjects: mongoose.Document[],
  difficultSubjects: mongoose.Document[],
  cb: (e: Error | null, department: mongoose.Document | null) => void
) {
  const password =
    '$2a$10$MkiI931dI34dr6WSD0Eah.QYFW/Tl2fZXeLK8DVlSFiS1bp.U7R1G'
  const user = new User({
    lastName,
    firstName,
    email: `${firstName}.${lastName}@insa-cvl.fr`,
    password,
    permissions,
    yearId: year,
    departmentId: department,
    favoriteSubjectsIds: favoriteSubjects,
    difficultSubjectsIds: difficultSubjects,
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
  campus?: Campus,
  startAt?: string,
  duration?: number,
  studentsCapacity?: number,
  tutorsCapacity?: number,
  room?: mongoose.Document
) {
  let post: mongoose.Document
  if (type === 'eleve') {
    post = new Post({
      comment,
      type,
      subjectId: subject,
      creatorId: creator,
      campus,
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
      studentsIds: [],
      tutorsIds: [creator],
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
        createSubject('mathématiques', callback)
      },
      (callback) => {
        createSubject('algorithme et programmation', callback)
      },
      (callback) => {
        createSubject('thermochimie', callback)
      },
      (callback) => {
        createSubject('optique ondulatoire', callback)
      },
      (callback) => {
        createSubject('résistance des matériaux', callback)
      },
      (callback) => {
        createSubject('électronique analogique', callback)
      },
      (callback) => {
        createSubject('analyse fonctionnelle', callback)
      },
      (callback) => {
        createSubject('anglais', callback)
      },
      (callback) => {
        createSubject('lv2', callback)
      },
      (callback) => {
        createSubject('culture et communication', callback)
      },
      (callback) => {
        createSubject('introduction au droit', callback)
      },
      (callback) => {
        createSubject('eps', callback)
      },
      (callback) => {
        createSubject('traitement du signal', callback)
      },
      (callback) => {
        createSubject('introduction aux bases de données', callback)
      },
      (callback) => {
        createSubject('sensibilisation à la sécurité informatique', callback)
      },
      (callback) => {
        createSubject('circuits programmables', callback)
      },
      (callback) => {
        createSubject('électromagnétisme', callback)
      },
      (callback) => {
        createSubject('mécanique des systèmes de solides', callback)
      },
      (callback) => {
        createSubject('cao', callback)
      },
      (callback) => {
        createSubject('électronique numérique', callback)
      },
      (callback) => {
        createSubject('électrotechnique', callback)
      },
      (callback) => {
        createSubject("introduction à l'économie", callback)
      },
      (callback) => {
        createSubject('desssin industriel', callback)
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
        createDepartment('gsi', callback)
      },
      (callback) => {
        createDepartment('sti', callback)
      },
      (callback) => {
        createDepartment('mri', callback)
      },
      (callback) => {
        createDepartment('ere', callback)
      },
      (callback) => {
        createDepartment('enp', callback)
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
          'blois',
          'b04',
          'lundi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b04',
          'lundi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b04',
          'mardi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b04',
          'mardi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b04',
          'mercredi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b04',
          'mercredi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b04',
          'jeudi',
          '1970-01-01T14:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b03',
          'lundi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b03',
          'lundi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b03',
          'mardi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b03',
          'mardi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b03',
          'mercredi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b03',
          'mercredi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'blois',
          'b03',
          'jeudi',
          '1970-01-01T14:00:00.000Z',
          120,
          callback
        )
      },
      // 14
      (callback) => {
        createRoom(
          'bourges',
          'e07',
          'lundi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e07',
          'lundi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e07',
          'mardi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e07',
          'mardi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e07',
          'mercredi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e07',
          'mercredi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e07',
          'jeudi',
          '1970-01-01T14:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e106',
          'lundi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e106',
          'lundi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e106',
          'mardi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e106',
          'mardi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e106',
          'mercredi',
          '1970-01-01T18:30:00.000Z',
          90,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e106',
          'mercredi',
          '1970-01-01T20:00:00.000Z',
          120,
          callback
        )
      },
      (callback) => {
        createRoom(
          'bourges',
          'e106',
          'jeudi',
          '1970-01-01T14:00:00.000Z',
          120,
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
          'Dustriel',
          'Firmin',
          ['tuteur'],
          years[0],
          departments[0],
          [subjects[0], subjects[1], subjects[2]],
          [],
          callback
        )
      },
      (callback) => {
        createUser(
          'Sicard',
          'Damiane',
          ['eleve'],
          years[0],
          departments[0],
          [subjects[1], subjects[2]],
          [subjects[3]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Arnoux',
          'Pauline',
          ['eleve', 'tuteur'],
          years[0],
          departments[0],
          [subjects[3]],
          [subjects[4], subjects[5]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Lazare',
          'Garcin',
          ['eleve'],
          years[0],
          departments[0],
          [],
          [subjects[4], subjects[5], subjects[6]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Hic',
          'Hyppolite',
          ['tuteur'],
          years[0],
          departments[0],
          [subjects[5], subjects[6], subjects[7]],
          [],
          callback
        )
      },
      (callback) => {
        createUser(
          'Duffet',
          'André',
          ['eleve'],
          years[1],
          departments[1],
          [subjects[6], subjects[7], subjects[8]],
          [],
          callback
        )
      },
      (callback) => {
        createUser(
          'Hépipioli',
          'Jeff',
          ['eleve', 'tuteur'],
          years[1],
          departments[2],
          [subjects[7]],
          [subjects[8], subjects[9]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Thibodeau',
          'Verrill',
          ['eleve'],
          years[1],
          departments[3],
          [subjects[8], subjects[9]],
          [subjects[10]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Porte',
          'Matéo',
          ['tuteur'],
          years[1],
          departments[5],
          [],
          [subjects[9], subjects[10], subjects[11]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Bazinet',
          'Suzette',
          ['eleve'],
          years[1],
          departments[5],
          [subjects[10], subjects[11], subjects[12]],
          [],
          callback
        )
      },
      (callback) => {
        createUser(
          'Roïd',
          'Paula',
          ['eleve', 'tuteur'],
          years[2],
          departments[1],
          [subjects[11], subjects[12]],
          [subjects[13]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Gaillou',
          'Langley',
          ['eleve'],
          years[2],
          departments[2],
          [subjects[12]],
          [subjects[13], subjects[14]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Moïse',
          'Archaimbau',
          ['tuteur'],
          years[2],
          departments[3],
          [subjects[13], subjects[14]],
          [subjects[15]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Fecteau',
          'Afrodille',
          ['eleve'],
          years[2],
          departments[4],
          [],
          [subjects[14], subjects[15], subjects[16]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Édouard',
          'Christiane',
          ['eleve', 'tuteur'],
          years[2],
          departments[5],
          [subjects[15], subjects[16]],
          [subjects[17]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Troijours',
          'Adam',
          ['eleve'],
          years[3],
          departments[1],
          [subjects[16], subjects[17]],
          [subjects[18]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Épan',
          'Ahmed',
          ['tuteur'],
          years[3],
          departments[2],
          [subjects[17]],
          [subjects[18], subjects[19]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Allard',
          'Felicien',
          ['eleve'],
          years[3],
          departments[3],
          [subjects[18], subjects[19]],
          [subjects[20]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Pique',
          'Sam',
          ['eleve', 'tuteur'],
          years[3],
          departments[4],
          [],
          [subjects[19], subjects[20], subjects[21]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Turcotte',
          'Odo',
          ['eleve'],
          years[3],
          departments[5],
          [subjects[20], subjects[21]],
          [subjects[22]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Denis',
          'Pansy',
          ['tuteur'],
          years[4],
          departments[1],
          [subjects[2], subjects[4]],
          [subjects[6]],
          callback
        )
      },
      (callback) => {
        createUser(
          'René',
          'Vaden',
          ['eleve'],
          years[4],
          departments[2],
          [subjects[8]],
          [subjects[10], subjects[12]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Fréchit',
          'Sarah',
          ['eleve', 'tuteur'],
          years[4],
          departments[3],
          [subjects[14], subjects[16]],
          [subjects[18]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Pariseau',
          'Oriel',
          ['eleve'],
          years[4],
          departments[4],
          [],
          [subjects[20], subjects[22], subjects[1]],
          callback
        )
      },
      (callback) => {
        createUser(
          'Akepourlui',
          'Yann',
          ['tuteur'],
          years[4],
          departments[5],
          [subjects[3], subjects[5]],
          [subjects[7]],
          callback
        )
      },
      (callback) => {
        createUser(
          'admin',
          'admin',
          ['admin'],
          years[0],
          departments[0],
          [subjects[0]],
          [subjects[0]],
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
      // Tuteur
      (callback) => {
        createPost(
          'Be careful you might learn here!',
          'tuteur',
          subjects[0],
          users[0],
          callback,
          '' as Campus,
          moment
            .utc()
            .day('lundi')
            .weekday(7)
            .hour(19)
            .minutes(0)
            .seconds(0)
            .milliseconds(0)
            .toISOString(),
          60,
          15,
          2,
          rooms[0]
        )
      },
      (callback) => {
        createPost(
          'TutorINSA is so funny !',
          'tuteur',
          subjects[2],
          users[2],
          callback,
          '' as Campus,
          moment
            .utc()
            .day('mardi')
            .weekday(8)
            .hour(18)
            .minutes(30)
            .seconds(0)
            .milliseconds(0)
            .toISOString(),
          90,
          20,
          3,
          rooms[2]
        )
      },
      (callback) => {
        createPost(
          'Yeah yeah you seem knowledgeable you!',
          'tuteur',
          subjects[4],
          users[4],
          callback,
          '' as Campus,
          moment
            .utc()
            .day('mercredi')
            .weekday(9)
            .hour(20)
            .minutes(20)
            .seconds(0)
            .milliseconds(0)
            .toISOString(),
          70,
          14,
          1,
          rooms[5]
        )
      },
      (callback) => {
        createPost(
          'You will learn so many things!',
          'tuteur',
          subjects[6],
          users[6],
          callback,
          '' as Campus,
          moment
            .utc()
            .day('lundi')
            .weekday(14)
            .hour(18)
            .minutes(45)
            .seconds(0)
            .milliseconds(0)
            .toISOString(),
          75,
          18,
          5,
          rooms[14]
        )
      },
      (callback) => {
        createPost(
          'Here, we save some semesters!',
          'tuteur',
          subjects[8],
          users[8],
          callback,
          '' as Campus,
          moment
            .utc()
            .day('jeudi')
            .weekday(10)
            .hour(14)
            .minutes(0)
            .seconds(0)
            .milliseconds(0)
            .toISOString(),
          60,
          20,
          5,
          rooms[20]
        )
      },
      (callback) => {
        createPost(
          'Just because we are the best!',
          'tuteur',
          subjects[10],
          users[10],
          callback,
          '' as Campus,
          moment
            .utc()
            .day('lundi')
            .weekday(21)
            .hour(20)
            .minutes(15)
            .seconds(0)
            .milliseconds(0)
            .toISOString(),
          45,
          20,
          4,
          rooms[22]
        )
      },
      // Eleve
      (callback) => {
        createPost(
          'please I need help to undersantd this subject !',
          'eleve',
          subjects[1],
          users[1],
          callback,
          'bourges'
        )
      },
      (callback) => {
        createPost(
          'can someone explain me this ?',
          'eleve',
          subjects[3],
          users[3],
          callback,
          'bourges'
        )
      },
      (callback) => {
        createPost(
          'can someone save my year, pls !',
          'eleve',
          subjects[5],
          users[5],
          callback,
          'bourges'
        )
      },
      (callback) => {
        createPost(
          'I think your better than me !',
          'eleve',
          subjects[7],
          users[7],
          callback,
          'bourges'
        )
      },
      (callback) => {
        createPost(
          'Will I be able to complete this semester ?',
          'eleve',
          subjects[9],
          users[9],
          callback,
          'bourges'
        )
      },
      (callback) => {
        createPost(
          "I 'm not the best, so I need help",
          'eleve',
          subjects[11],
          users[11],
          callback,
          'bourges'
        )
      },
      (callback) => {
        createPost(
          'Can you help me to understand this subject ?',
          'eleve',
          subjects[13],
          users[13],
          callback
        )
      },
      (callback) => {
        createPost(
          'Heho ! Need help',
          'eleve',
          subjects[15],
          users[15],
          callback,
          'blois'
        )
      },
      (callback) => {
        createPost('Please ?', 'eleve', subjects[19], users[19], callback)
      },
      (callback) => {
        createPost(
          "I now, I'm late but please !",
          'eleve',
          subjects[21],
          users[21],
          callback,
          'blois'
        )
      },
      (callback) => {
        createPost(
          'Your mission is to save my semester !',
          'eleve',
          subjects[22],
          users[23],
          callback,
          'blois'
        )
      },
    ],
    cb
  )
}
function subscribe(cb: () => void) {
  async.series(
    [
      // 0
      (callback) => {
        createSubscription(posts[0], users[9], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[0], users[10], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[0], users[11], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[0], users[13], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[0], users[14], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[0], users[12], 'tuteur', callback)
      },
      // 1
      (callback) => {
        createSubscription(posts[1], users[15], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[1], users[17], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[1], users[18], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[1], users[19], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[1], users[21], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[1], users[12], 'tuteur', callback)
      },
      (callback) => {
        createSubscription(posts[1], users[14], 'tuteur', callback)
      },
      // 2
      (callback) => {
        createSubscription(posts[2], users[22], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[2], users[23], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[2], users[1], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[2], users[2], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[2], users[3], 'eleve', callback)
      },
      // 3
      (callback) => {
        createSubscription(posts[3], users[5], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[3], users[23], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[3], users[7], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[3], users[9], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[3], users[10], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[3], users[16], 'tuteur', callback)
      },
      (callback) => {
        createSubscription(posts[3], users[18], 'tuteur', callback)
      },
      (callback) => {
        createSubscription(posts[3], users[20], 'tuteur', callback)
      },
      // 4
      (callback) => {
        createSubscription(posts[4], users[11], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[4], users[13], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[4], users[14], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[4], users[15], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[4], users[17], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[4], users[24], 'tuteur', callback)
      },
      // 5
      (callback) => {
        createSubscription(posts[5], users[18], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[5], users[19], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[5], users[21], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[5], users[22], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[5], users[23], 'eleve', callback)
      },
      (callback) => {
        createSubscription(posts[5], users[0], 'tuteur', callback)
      },
      (callback) => {
        createSubscription(posts[5], users[2], 'tuteur', callback)
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
