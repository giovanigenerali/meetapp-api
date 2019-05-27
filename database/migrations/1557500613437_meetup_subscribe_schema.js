'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MeetupSubscribeSchema extends Schema {
  up () {
    this.create('meetup_subscribes', table => {
      table.increments()
      table
        .integer('meetup_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('meetups')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('meetup_subscribes')
  }
}

module.exports = MeetupSubscribeSchema
