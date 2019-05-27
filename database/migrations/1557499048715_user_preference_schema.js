'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserPreferenceSchema extends Schema {
  up () {
    this.create('user_preferences', table => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
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
    this.drop('user_preferences')
  }
}

module.exports = UserPreferenceSchema
