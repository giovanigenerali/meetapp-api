'use strict'

const Env = use('Env')
const fs = use('fs')
const Helpers = use('Helpers')

const Meetup = use('App/Models/Meetup')

class MeetupController {
  async index ({ request, auth: { user } }) {
    const { page, filter, title } = request.get()

    let query = Meetup.query()
      .withCount('members')
      .with('themes')

    /** search by title */
    if (title) {
      query = query.whereRaw(`LOWER(title) LIKE '%${title.toLowerCase()}%'`)
    }

    /** search by filter */
    if (filter) {
      if (filter === 'subscribed') {
        query = query.subscribed(user.id)
      } else if (filter === 'upcoming') {
        query = query.upcoming()
      } else if (filter === 'recomended') {
        const userPreferences = (await user.preferences().fetch())
          .toJSON()
          .map(preference => preference.id)
        query = query.recomended(user.id, userPreferences)
      }
    }

    const meetups = await query.paginate(page)

    return meetups
  }

  async store ({ response, request, auth: { user } }) {
    const data = request.only(['title', 'description', 'where', 'when'])

    try {
      const meetup = await Meetup.create({
        ...data,
        user_id: user.id
      })

      const meetupImage = request.file('image', {
        types: ['image'],
        size: '2mb',
        extnames: ['png', 'jpg']
      })

      const imageName = `${meetup.id}.${meetupImage.extname}`

      await meetupImage.move(Helpers.tmpPath('uploads'), {
        name: imageName,
        overwrite: true
      })

      if (!meetupImage.moved()) {
        return response.status(400).send(meetupImage.error())
      }

      meetup.merge({ image: `${Env.get('APP_URL')}/images/${imageName}` })

      await meetup.save()

      const themesId = request.input(['themes_id'])

      if (themesId) {
        try {
          await meetup.themes().attach(themesId)
        } catch (err) {
          return response.status(400).send()
        }
      } else {
        return response.status(400).send()
      }

      const meetupNew = await Meetup.query()
        .where('id', meetup.id)
        .with('themes')
        .first()

      return response.status(201).send(meetupNew)
    } catch (err) {
      return response.status(400).send()
    }
  }

  async show ({ params, response, auth: { user } }) {
    const meetup = await Meetup.query()
      .where('id', params.id)
      .withCount('members')
      .with('members')
      .with('themes')
      .with('user')
      .first()

    if (!meetup) {
      return response.status(404).send({
        error: {
          message: 'Meetup não encontrado.'
        }
      })
    }

    meetup.subscribed = meetup.toJSON().members
      ? !!meetup.toJSON().members.find(member => member.id === user.id)
      : false

    return meetup
  }

  async update ({ params, request, response, auth: { user } }) {
    const meetup = await Meetup.query()
      .where('id', params.id)
      .first()

    if (meetup.user_id !== user.id) {
      return response.status(401).send({
        error: {
          message: 'Apenas o criador do meetup pode editá-lo.'
        }
      })
    }

    const data = request.only(['title', 'description', 'where', 'when'])

    const meetupImage = request.file('image', {
      types: ['image'],
      size: '2mb',
      extnames: ['png', 'jpg']
    })

    const imageName = `${meetup.id}.${meetupImage.extname}`

    await meetupImage.move(Helpers.tmpPath('uploads'), {
      name: imageName,
      overwrite: true
    })

    meetup.merge({
      ...data,
      image: `${Env.get('APP_URL')}/images/${imageName}`
    })

    await meetup.save()

    const themesId = request.input(['themes_id'])

    if (themesId) {
      await meetup.themes().detach()
      await meetup.themes().attach(themesId)
    }

    const meetupUpdated = await Meetup.query()
      .where('id', params.id)
      .withCount('members')
      .with('themes')
      .fetch()

    return meetupUpdated
  }

  async destroy ({ params, response, auth: { user } }) {
    const removeImage = Helpers.promisify(fs.unlink)
    const meetup = await Meetup.find(params.id)

    if (meetup.user_id !== user.id) {
      return response.status(401).send({
        error: {
          message: 'Apenas o criador do meetupo pode excluí-lo'
        }
      })
    }

    if (meetup.image) {
      const imageFile = meetup.image.replace(
        `${Env.get('APP_URL')}/images/`,
        ''
      )
      removeImage(`${Helpers.tmpPath('uploads')}/${imageFile}`)
    }

    await meetup.delete()
  }
}

module.exports = MeetupController
