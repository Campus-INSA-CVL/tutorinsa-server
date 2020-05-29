import {
  checkMinutes,
  checkDuration,
  checkDate,
  checkEmail,
} from '../../../src/models/validation/validate'

import moment from '../../../src/utils/moment'

describe("'custom validation' for fields", () => {
  describe('check minutes', () => {
    it.each(['00', '30'])(
      'should be true with correct data, %s minutes',
      (key) => {
        const result = checkMinutes.validator(
          `Fri, 15 May 2020 17:${key}:34 GMT`
        )

        expect(result).toBe(true)
      }
    )
    it('should be false with uncorrect data', () => {
      const result = checkMinutes.validator('Fri, 15 May 2020 17:17:34 GMT')

      expect(result).toBe(false)
    })
  })

  describe('check duration', () => {
    it('should be true with correct data', () => {
      const result = checkDuration.validator(120)

      expect(result).toBe(true)
    })
    it('should be false with uncorrect data', () => {
      const result = checkDuration.validator(121)

      expect(result).toBe(false)
    })
  })

  describe('check date', () => {
    it('should be true with correct data', () => {
      const result = checkDate.validator(moment().add(1, 'days').toISOString())

      expect(result).toBe(true)
    })
    it('should be false with uncorrect data', () => {
      const result = checkDate.validator(
        moment().subtract(1, 'days').toISOString()
      )

      expect(result).toBe(false)
    })
  })

  describe('check email', () => {
    it('should be true with correct data', () => {
      const result = checkEmail.validator('user@insa-cvl.fr')

      expect(result).toBe(true)
    })

    it('should be false with uncorrect data', () => {
      const result = checkEmail.validator('custom@unvalide.email')

      expect(result).toBe(false)
    })

    it.todo('should return the correct message')
  })
})
