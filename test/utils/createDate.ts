import moment from '../../src/utils/moment'

/**
 * Create the perfecte date for the post
 * @returns {string}
 */
export default function createDate(minutes: number = 0): string {
  const date = moment
    .utc()
    .day('lundi')
    .weekday(7)
    .hour(20)
    .minutes(minutes)
    .seconds(0)
    .milliseconds(0)
  return date.toISOString()
}
