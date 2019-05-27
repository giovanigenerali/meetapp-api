'use strict'

const MeetupSubscribe = use('App/Models/MeetupSubscribe')

class MeetupSubscribeControlle {
  async store ({ params, response, auth: { user } }) {
    const subscribed = await MeetupSubscribe.query()
      .where('meetup_id', params.id)
      .where('user_id', user.id)
      .first()

    if (subscribed) {
      return response.status(406).send({
        error: {
          message: 'Você já está inscrito no meetup.'
        }
      })
    }

    await MeetupSubscribe.create({
      meetup_id: params.id,
      user_id: user.id
    })
  }

  async delete ({ params, response, auth: { user } }) {
    const subscription = await MeetupSubscribe.query()
      .where('meetup_id', params.id)
      .where('user_id', user.id)
      .first()

    if (!subscription) {
      return response.status(406).send({
        error: {
          message:
            'Você não está inscrito no meetup para cancelar sua inscrição.'
        }
      })
    }

    await subscription.delete()
  }
}

module.exports = MeetupSubscribeControlle
