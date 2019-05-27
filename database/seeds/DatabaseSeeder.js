'use strict'

const Theme = use('App/Models/Theme')
const User = use('App/Models/User')
const MeetupSubscribe = use('App/Models/MeetupSubscribe')

class DatabaseSeeder {
  async run () {
    /** Create meetup themes */
    const themes = await Theme.createMany([
      { title: 'Front-end' },
      { title: 'Back-end' },
      { title: 'Mobile' },
      { title: 'DevOps' },
      { title: 'Gestão' },
      { title: 'Marketing' }
    ])

    /** Create user */
    // const user = await User.create({
    //   name: 'Giovani Generali',
    //   email: 'giovani.generali@gmail.com',
    //   password: '123456'
    // })

    /** Attach user and preference (theme) */
    // await user.preferences().attach([themes[0].id, themes[1].id])

    // /** Create meetup */
    // const meetup = await user.meetups().create({
    //   title: 'Meetup NodeJS',
    //   description:
    //     'O meetup de NodeJS é um espaço para discutir sobre tecnologias por volta do desenvolvimento web utilizando Node.js',
    //   where: 'Rua Teste, 123 - São Paulo/SP',
    //   when: '2019-05-20 09:00:00',
    //   user_id: user.id
    // })

    /** Attach meetup and theme */
    // await meetup
    //   .themes()
    //   .attach([themes[0].id, themes[1].id, themes[2].id, themes[3].id])

    /** Create subscriber */
    /** TODO: image upload */
    // const member = await User.create({
    //   name: 'John Doe',
    //   email: 'john.doe@gmail.com',
    //   password: '123456'
    //   image: null
    // })

    /** Attach member and preference (theme) */
    // await member.preferences().attach([themes[0].id])

    /** Subscriber user to meetup */
    // await MeetupSubscribe.create({
    //   meetup_id: meetup.id,
    //   user_id: member.id
    // })
  }
}

module.exports = DatabaseSeeder
