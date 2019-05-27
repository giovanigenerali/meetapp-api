'use strict'

const Theme = use('App/Models/Theme')

class ThemeController {
  async index () {
    const themes = await Theme.all()

    return themes
  }
}

module.exports = ThemeController
