import {
  createSlots,
  createUTCStartTime,
  createConcatDate,
} from '../../../src/services/calendars/calendars.functions'
import moment from '../../../src/utils/moment'

describe("'calendar.functions'", () => {
  describe("'create-slots' function", () => {
    it('should create slot', () => {
      const start = '2020-05-21T20:00:00.000Z'
      const duration = 60
      const postId = 'id'

      const result = createSlots(start, duration, postId)

      expect(Array.isArray(result)).toBeTruthy()
      expect(result.length).toBe(2)
      result.forEach((element, index) => {
        expect(element).toHaveProperty('postId', postId)
        expect(element).toHaveProperty(
          'startAt',
          moment(start)
            .add(30 * index, 'minutes')
            .toISOString()
        )
        expect(element).toHaveProperty('occupied', true)
      })
    })
  })

  describe("'create-concate-date' function", () => {
    it('should concatenate two date', () => {
      const date = '2020-05-21T20:00:00.000Z'
      const time = '1970-01-01T21:00:00.000Z'

      const result = createConcatDate(date, time)

      expect(result).toBe('2020-05-21T21:00:00.000Z')
    })
  })

  describe("'create-UTC-start-time' function", () => {
    it('should throw an error if the date is invalide', () => {
      const date = 'data'
      try {
        createUTCStartTime(date)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(`'${date}' is not a valide date`)
      }
    })
    it("should return a new 1970's date", () => {
      const date = '2020-05-21T20:00:00.000Z'

      const result = createUTCStartTime(date)

      expect(result).toBe('1970-01-01T20:00:00.000Z')
    })
  })

  describe("'remove-slots' function", () => {
    it.todo('should create an new array removing the unwanted slots')
  })
  describe("'patch-slots' function", () => {
    it.todo('should create an new array using the new duration')
  })
})
