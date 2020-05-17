/* import { AdapterService } from '@feathersjs/adapter-commons'
import { Service } from 'feathers-mongoose'
import { Params } from '@feathersjs/feathers'
import { Posts } from '../../../src/services/posts/posts.class'
import createModel from '../../../src/models/posts.model'
import app from '../../../src/app'
import { Post } from '../../../src/declarations'

describe("'posts.class'", () => {
  describe("'create' method", () => {
    afterAll(() => {
      app.get('mongooseClient').connection.close()
    })

    const _create = jest.spyOn(Service.prototype, '_create')
    it('should add the user Id to the data', async () => {
      expect.assertions(2)
      const options = {
        Model: createModel(app),
        paginate: app.get('paginate'),
      }

      const posts = new Posts(options, app)

      const params: Params = {
        user: {
          _id: 'az1234',
          name: 'fake',
        },
      }

      const data = {
        comment: 'hello',
      }

      try {
        await posts.create(data as Post, params)
      } catch (e) {
        //
      }

      expect(_create).toHaveBeenCalled()
      expect(_create).toHaveBeenCalledWith(
        {
          comment: data.comment,
          creatorId: params.user._id,
          tutorsIds: [params.user._id],
        },
        params
      )
    })
  })
})
 */
