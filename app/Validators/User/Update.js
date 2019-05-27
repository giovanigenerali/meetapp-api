'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      password: 'confirmed|min:6'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store
