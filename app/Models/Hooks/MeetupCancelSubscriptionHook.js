'use strict'

const Moment = use('moment')
Moment.locale('pt-br')

const Kue = use('Kue')
const Job = use('App/Jobs/MeetupCancelSubscriptionMail')

const MeetupCancelSubscriptionHook = (exports = module.exports = {})

MeetupCancelSubscriptionHook.sendMail = async subscription => {
  const user = await subscription.user().fetch()
  const meetup = (await subscription.meetup().fetch()).toJSON()

  Kue.dispatch(
    Job.key,
    {
      meetup: {
        ...meetup,
        when: Moment(meetup.when).format('LLL')
      },
      user
    },
    { attempts: 3 }
  )
}
