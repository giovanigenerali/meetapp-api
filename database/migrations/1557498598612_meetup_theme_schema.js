'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MeetupThemeSchema extends Schema {
  up () {
    this.create('meetup_themes', table => {
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
        .integer('theme_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('themes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('meetup_themes')
  }
}

module.exports = MeetupThemeSchema
