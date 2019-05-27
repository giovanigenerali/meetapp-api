'use strict'

const Model = use('Model')

class Meetup extends Model {
  static scopeSubscribed (query, userId) {
    return query.whereHas('members', builder => {
      builder.where('user_id', userId).orderBy('when', 'asc')
    })
  }

  static scopeUpcoming (query) {
    return query.where('when', '>', 'now()').orderBy('when', 'asc')
  }

  static scopeRecomended (query, userId, userPreferences) {
    query = query
      .whereHas('themes', builder => {
        builder.whereIn('theme_id', userPreferences)
      })
      .whereDoesntHave('members', builder => {
        builder.where('user_id', userId)
      })
      .orderBy('when', 'asc')
  }

  themes () {
    return this.belongsToMany('App/Models/Theme').pivotTable('meetup_themes')
  }

  members () {
    return this.belongsToMany('App/Models/User').pivotTable('meetup_subscribes')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Meetup
