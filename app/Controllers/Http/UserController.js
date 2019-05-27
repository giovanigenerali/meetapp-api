'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({ response, request }) {
    const data = request.only(['name', 'email', 'password'])
    const user = await User.create(data)

    return response.status(201).send(user)
  }

  async show ({ auth: { user } }) {
    const profile = await User.query()
      .where('id', user.id)
      .with('preferences')
      .first()

    return profile
  }

  async update ({ response, request, auth: { user } }) {
    const data = request.only(['name', 'password'])

    if (!data.name) {
      delete data.name
    }

    if (!data.password) {
      delete data.password
    }

    user.merge(data)

    await user.save()

    const preferencesId = request.input(['preferences_id'])

    if (preferencesId) {
      try {
        await user.preferences().detach()
        await user.preferences().attach(preferencesId)
      } catch (err) {
        return response.status(400).send()
      }
    }

    const userUpdated = await User.query()
      .where('id', user.id)
      .with('preferences')
      .first()

    return userUpdated
  }
}

module.exports = UserController
