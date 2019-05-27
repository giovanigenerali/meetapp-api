'use strict'

const Mail = use('Mail')

class MeetupSubscriptionMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'MeetupSubscriptionMail-job'
  }

  async handle ({ meetup, user }) {
    await Mail.send(
      ['emails.meetup_subscription'],
      { meetup, user },
      message => {
        message
          .to(user.email)
          .from('subscription@meetupapp.com', 'MeetupApp')
          .subject(`Confirmação de inscrição - ${meetup.title}`)
      }
    )
  }
}

module.exports = MeetupSubscriptionMail
