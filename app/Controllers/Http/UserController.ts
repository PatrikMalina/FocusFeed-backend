import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
}
