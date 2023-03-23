import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

export default class AuthController {
  async register({ request }: HttpContextContract) {
    // if invalid, exception
    const data = await request.validate(RegisterUserValidator)
    const user = await User.create(data)

    return user
  }

  async login({ auth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    return auth.use('api').attempt(email, password, {
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
