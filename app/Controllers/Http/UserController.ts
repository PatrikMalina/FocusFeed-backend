import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import fs from 'fs';
import User from 'App/Models/User'

export default class UserController {
  async updateProfileEmail({ request, auth, response }: HttpContextContract) {
    const user = await User.findBy('id', auth.user?.id)
    const email = request.input('email')

    if (user != null) {
      const tempUser = await User.findBy('email', email)

      if (tempUser == null || tempUser.id == auth.user?.id) {
        user.email = email
        await user.save()

        return response.status(201).json({
          message: 'Email updated successfully!',
          data: email,
        })
      }
    }
  }

  async updateProfileInfo({ request, auth, response}: HttpContextContract) {
    const user = await User.findBy('id', auth.user?.id)
    const username = request.input('data').username
    const password = request.input('data').password
    const pictureString = request.input('data').picture
    if (user != null) {
      if (username) {
        user.username = username
      }
      if (password) {
        user.password = password
      }
      if (pictureString) {
        const imagePath = path.join('public', 'images', 'post-' + Date.now() + '.jpg')
        const imagePathWithoutPublic = imagePath.replace(/^public\\/, '')
        const imageBuffer = Buffer.from(pictureString, 'base64')
        const writeStream = fs.createWriteStream(imagePath)
        writeStream.write(imageBuffer)
        writeStream.end()
        user.pictureUrl = imagePathWithoutPublic
      }
      await user.save()   
      return response.status(201).json({
        message: 'Profile updated successfully!',
        data: user,
      })
  }
}
}
