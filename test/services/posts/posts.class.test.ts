import { AdapterService } from '@feathersjs/adapter-commons'
import { Service } from 'feathers-mongoose'
import { Posts } from '../../../src/services/posts/posts.class'
import { Application } from '@feathersjs/express'

import createModel from '../../../src/models/posts.model'
import app from '../../../src/app'

const spy2 = jest.spyOn(Service.prototype, '_get')
// jest.genMockFromModule('feathers-mongoose')
// jest.mock('feathers-mongoose')
// console.log('Service.prototype:', Service.prototype)
// console.log('Service:', new Service()._find())
// console.log('spy2:', spy2)

it('test', async () => {
  // const options = {
  //   Model: createModel(app),
  //   paginate: app.get('paginate'),
  // }
  // const posts = new Posts(options, app)
  // console.log('posts:', await posts.find({ query: { id: 'bonjour' } }))

  // // console.log('await posts.find:', await posts.find({}))

  // expect(spy2).toHaveBeenCalled()
  // expect(spy2).toHaveBeenCalledWith({ query: { id: 'bonjour' } })

  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }
  const posts = new Posts(options, app)
  try {
    await posts.get('5eb5b6f7d78c6a59fc3e2929', {})
  } catch (error) {
    // console.log(error)
  }

  // console.log('await posts.find:', await posts.find({}))

  expect(spy2).toHaveBeenCalled()
  expect(spy2).toHaveBeenCalledWith('5eb5b6f7d78c6a59fc3e2929', {})
})
describe("'posts.class'", () => {
  describe("'create' method", () => {
    it.todo('should add the user Id to the data')
  })
})
