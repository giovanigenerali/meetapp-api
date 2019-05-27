'use strict'

const { test, trait } = use('Test/Suite')('User')

trait(suite => {
  suite.Context.getter('fakeUser', () => {
    return {
      name: 'User Fake',
      email: 'user.fake@mail.com',
      password: '123456'
    }
  })
})

trait('Test/ApiClient')

test('can create a user with valid data', async ({ fakeUser, client }) => {
  const response = await client
    .post('/users')
    .send(fakeUser)
    .end()

  response.assertStatus(201)
})

test('cannot create a user if no data', async ({ client }) => {
  const response = await client
    .post('/users')
    .send()
    .end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'The name is required.',
      field: 'name',
      validation: 'required'
    },
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

test('cannot create a user with invalid email', async ({
  fakeUser,
  client
}) => {
  fakeUser.email = 'user.fake@mail'

  const response = await client
    .post('/users')
    .send(fakeUser)
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

test('cannot create a user with password less than 6', async ({
  fakeUser,
  client
}) => {
  fakeUser.password = '123'

  const response = await client
    .post('/users')
    .send(fakeUser)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([
    {
      message: 'The password should not be less than 6.',
      field: 'password',
      validation: 'min'
    }
  ])
})

test('cannot create a user with duplicated email', async ({
  fakeUser,
  client
}) => {
  await client
    .post('/users')
    .send(fakeUser)
    .end()

  const response = await client
    .post('/users')
    .send(fakeUser)
    .end()

  response.assertStatus(400)

  response.assertError([
    {
      message: 'The email has already been taken by someone else.',
      field: 'email',
      validation: 'unique'
    }
  ])
})
