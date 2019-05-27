'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Session')

trait('Test/ApiClient')

test('can create a session with valid data', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const data = {
    email: user.email,
    password: '123456'
  }

  const response = await client
    .post('/sessions')
    .send(data)
    .end()

  response.assertStatus(200)
  response.assertJSON({
    type: 'bearer',
    token: response.body.token,
    refreshToken: null
  })
})

test('cannot create a session if no data', async ({ client }) => {
  const response = await client
    .post('/sessions')
    .send()
    .end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'The email is required.',
      field: 'email',
      validation: 'required'
    },
    {
      message: 'The password is required.',
      field: 'password',
      validation: 'required'
    }
  ])
})

test('cannot create a session with invalid email', async ({ client }) => {
  const data = {
    email: 'giovani.generali@gmail',
    password: '123456'
  }

  const response = await client
    .post('/sessions')
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'The email should be a valid email address.',
      field: 'email',
      validation: 'email'
    }
  ])
})

test('cannot create a session without password', async ({ client }) => {
  const data = {
    email: 'giovani.generali@gmail.com',
    password: ''
  }

  const response = await client
    .post('/sessions')
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'The password is required.',
      field: 'password',
      validation: 'required'
    }
  ])
})

test('can not create session if user does not exist', async ({ client }) => {
  const data = {
    email: 'user@mail.com',
    password: 'password'
  }

  const response = await client
    .post('/sessions')
    .send(data)
    .end()

  response.assertStatus(401)
})
