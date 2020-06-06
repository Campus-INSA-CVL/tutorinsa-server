import path from 'path'
import fs from 'fs'
import util from 'util'
import yaml from 'js-yaml'

import logger from '../../logger'

/**
 * load yml file and return it in json
 * @param {string} name name of the yml file containing the documentation
 * @returns {object} the file data
 */
const loader = (name: string): object => {
  let data: object

  try {
    const filename = path.join(__dirname, '..', name)
    const contents = fs.readFileSync(filename, 'utf8')
    data = yaml.safeLoad(contents)
  } catch (e) {
    logger.error(e)
    data = {}
  }

  return data
}

export default loader
