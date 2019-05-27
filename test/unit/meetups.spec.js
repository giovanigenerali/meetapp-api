'use strict'

const Helpers = use('Helpers')
const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Meetup')

trait('Test/ApiClient')
trait('Auth/Client')

test('can create a meetup with valid data', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const themes = await Factory.model('App/Models/Theme').createMany(2)

  const response = await client
    .post('/meetups')
    .field('title', 'Meetup Fake')
    .field('description', 'Meetup fake description')
    .field('where', 'Convetion Center Fake, 123')
    .field('when', '2019-12-01 09:00:00')
    .field('themes_id[]', themes[0].id)
    .field('themes_id[]', themes[1].id)
    .attach('image', Helpers.tmpPath('../test/assets/meetup-fake.jpg'))
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(201)
})

test('cannot create a meetup if no data', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .post('/meetups')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(400)
  response.assertError([
    {
      message: 'The title is required.',
      field: 'title',
      validation: 'required'
    },
    {
      message: 'The description is required.',
      field: 'description',
      validation: 'required'
    },
    {
      message: 'The where is required.',
      field: 'where',
      validation: 'required'
    },
    {
      message: 'The when is required.',
      field: 'when',
      validation: 'required'
    },
    {
      message: 'The image is required.',
      field: 'image',
      validation: 'required'
    }
  ])
})

test('cannot create a meetup with image greater than 2mb', async ({
  client
}) => {
  const user = await Factory.model('App/Models/User').create()
  const themes = await Factory.model('App/Models/Theme').createMany(2)

  const response = await client
    .post('/meetups')
    .field('title', 'Meetup Fake 2')
    .field('description', 'Meetup fake description 2')
    .field('where', 'Convetion Center Fake, 123')
    .field('when', '2019-12-02 09:00:00')
    .field('themes_id[]', themes[0].id)
    .field('themes_id[]', themes[1].id)
    .attach('image', Helpers.tmpPath('../test/assets/meetup-fake-2mb.jpg'))
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(400)
  response.assertError({
    fieldName: 'image',
    clientName: 'meetup-fake-2mb.jpg',
    message: 'File size should be less than 2MB',
    type: 'size'
  })
})
