'use strict'

const Helpers = use('Helpers')

class ImageController {
  async show ({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/${params.path}`))
  }
}

module.exports = ImageController
