import yamlLoader from '../../../src/docs/utils/yamlLoader'

jest.mock('../../../src/logger')
import logger from '../../../src/logger'

describe('yamlLoader', () => {
  it('should log the error and return an empty object', () => {
    const data = yamlLoader('fakename.yml')

    expect(data).toEqual({})
    expect(logger.error).toHaveBeenCalled()
  })
})
