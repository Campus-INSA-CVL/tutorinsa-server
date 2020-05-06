import path from 'path'
import fs from 'fs'
import util from 'util'
import yaml from 'js-yaml'

import logger from '../../logger'

/**
 * load yml file and return it in json
 * @param name name of the yml file containing the documentation
 * @param debug
 */
const loader = (name: string, debug: boolean = false): object => {
  let data: object

  try {
    const filename = path.join(__dirname, '..', name)
    const contents = fs.readFileSync(filename, 'utf8')
    data = yaml.safeLoad(contents)
  } catch (e) {
    logger.error(e)
    data = {}
  }

  if (debug) {
    logger.debug(util.inspect(data, false, 10, true))
  }

  return data
}

export default loader
