import moment from '../../src/utils/moment'

/**
 * Create the perfecte date for the post
 * @returns {string}
 */
export default function createDate(): string {
  const date = moment
    .utc()
    .day('lundi')
    .weekday(7)
    .hour(20)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
  return date.toISOString()
}
