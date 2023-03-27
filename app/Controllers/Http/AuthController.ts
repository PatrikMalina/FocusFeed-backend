import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

export default class AuthController {
  async register({ request }: HttpContextContract) {
    // if invalid, exception
    let user
    try {
      let data = await request.validate(RegisterUserValidator)
      data['pictureUrl'] = 'images/defaultAvatar.jpg'
      user = await User.create(data)
    } catch (error) {
      return error
    }

    return user
  }

  async login({ auth, request }: HttpContextContract) {
    const username = request.input('username')
    const password = request.input('password')

    return auth.use('api').attempt(username, password, {
      expiresIn: '7 days',
    })
  }

  async logout({ auth }: HttpContextContract) {
    return auth.use('api').logout()
  }

  async me({ auth }: HttpContextContract) {
    // Load stuff for the user (maybe post, chats...)
    return auth.user
  }
}
