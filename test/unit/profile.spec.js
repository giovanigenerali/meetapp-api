'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Profile')

trait('Test/ApiClient')
trait('Auth/Client')

test('can get profile data', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .get('/profile')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
    preferences: []
  })
})

test('can update profile name', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .send({
      name: 'Fake User'
    })
    .end()

  response.assertStatus(200)

  response.assertJSONSubset({
    name: 'Fake User'
  })
})

test('can update profile password', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .send({
      password: 'password123',
      password_confirmation: 'password123'
    })
    .end()

  response.assertStatus(200)
})

test('can update profile preferences', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const preferences = await Factory.model('App/Models/Theme').createMany(2)

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .send({
      preferences_id: [preferences[0].id, preferences[1].id]
    })
    .end()

  response.assertStatus(200)

  response.assertJSONSubset({
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
    preferences: [
      {
        id: preferences[0].id
      },
      {
        id: preferences[1].id
      }
    ]
  })
})

test('cannot update profile with password less than 6', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .send({
      password: '123',
      password_confirmation: '123'
    })
    .end()

  response.assertStatus(400)
})

test('cannot update profile with password confirmation does not match', async ({
  client
}) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .send({
      password: 'password123',
      password_confirmation: '123'
    })
    .end()

  response.assertStatus(400)
})

test('cannot update profile with preferences does not exist', async ({
  client
}) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .put('/profile')
    .loginVia(user, 'jwt')
    .send({
      preferences_id: [null]
    })
    .end()

  response.assertStatus(400)
})
