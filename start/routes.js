'use strict'

const Route = use('Route')

Route.get('/', ({ response }) => {
  return response.status(401).send()
})

Route.post('users', 'UserController.store').validator('User/Store')

Route.post('sessions', 'SessionController.store').validator('Session')

Route.group(() => {
  Route.get('profile', 'UserController.show')
  Route.put('profile', 'UserController.update').validator('User/Update')

  Route.resource('meetups', 'MeetupController')
    .apiOnly()
    .validator(
      new Map([
        [['meetups.store'], ['Meetup/Store']],
        [['meetups.update'], ['Meetup/Update']]
      ])
    )

  Route.get('themes', 'ThemeController.index')
  Route.post('meetups/:id/subscribe', 'MeetupSubscribeController.store')
  Route.delete('meetups/:id/unsubscribe', 'MeetupSubscribeController.delete')
}).middleware('auth')

Route.get('images/:path', 'ImageController.show')
