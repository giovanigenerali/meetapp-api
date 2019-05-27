'use strict'

const Mail = use('Mail')

class MeetupCancelSubscriptionMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'MeetupCancelSubscriptionMail-job'
  }

  async handle ({ meetup, user }) {
    await Mail.send(
      ['emails.meetup_cancelsubscription'],
      { meetup, user },
      message => {
        message
          .to(user.email)
          .from('subscription@meetupapp.com', 'MeetupApp')
          .subject(`Cancelamento de inscrição - ${meetup.title}`)
      }
    )
  }
}

module.exports = MeetupCancelSubscriptionMail
