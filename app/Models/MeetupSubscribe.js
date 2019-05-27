'use strict'

const Model = use('Model')

class MeetupSubscribe extends Model {
  static boot () {
    super.boot()

    this.addHook('afterCreate', 'MeetupSubscriptionHook.sendMail')
    this.addHook('afterDelete', 'MeetupCancelSubscriptionHook.sendMail')
  }

  meetup () {
    return this.belongsTo('App/Models/Meetup')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = MeetupSubscribe
