'use strict'

const Factory = use('Factory')

Factory.blueprint('App/Models/User', faker => {
  return {
    name: faker.name(),
    email: faker.email(),
    password: '123456'
  }
})

Factory.blueprint('App/Models/Theme', faker => {
  return {
    title: faker.sentence()
  }
})
