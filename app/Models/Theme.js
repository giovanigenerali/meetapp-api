'use strict'

const Model = use('Model')

class Theme extends Model {
  static get hidden () {
    return ['created_at', 'updated_at']
  }
}

module.exports = Theme
