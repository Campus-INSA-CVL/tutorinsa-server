import moment from '../../utils/moment'

/**
 * Check that the value have minute equal to 00 or 30
 */
const checkMinutes = {
  validator: (value: Date) =>
    /^(0|3)?0$/.test(value.getUTCMinutes().toString()),
  message: 'only 00 or 30 for minute is allowed for startAt',
}

/**
 * Check that the value is a multiple of 30
 */
const checkDuration = {
  validator: (value: number) => !(value % 30),
  message: 'must be a multiple of 30',
}

/**
 * Check that the Date is after today
 */
const checkDate = {
  validator: (value: Date) => moment().diff(value) < 0,
  message: "can't register with a date in the past",
}

/**
 * Check that the value is a valid email
 */
const checkEmail = {
  validator: (value: string) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@insa-cvl\.fr$/.test(
      value
    )
  },
  message: (props: any) => `${props.value} is not a valid email`,
}

export { checkMinutes, checkDuration, checkDate, checkEmail }
