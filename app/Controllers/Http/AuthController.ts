import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import Friend from 'App/Models/Friend'
import Message from 'App/Models/Message'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

export default class AuthController {
  async register({ request, response }: HttpContextContract) {
    // if invalid, exception
    let user
    try {
      let data = await request.validate(RegisterUserValidator)
      data['pictureUrl'] = 'images/defaultAvatar.jpg'
      user = await User.create(data)

      const focus = await User.findBy('id', 1).finally()

      if (user && focus) {
        await Friend.create({
          sentTo: user.id,
          sentBy: focus.id,
          accepted: 1,
        })

        const chat = await Chat.create({
          user1: user.id,
          user2: focus.id,
        })

        await Message.create({
          chatId: chat.id,
          createdBy: focus.id,
          content: 'Welcome to the FocusFeed! 🎉😃',
        })
      }
    } catch (error) {
      if (error.status === 422) {
        return response.status(409).json({
          message: 'Conflict',
          error: error.messages,
        })
      }

      return response.status(400).json({
        message: 'Bad Request',
        error: error.messages,
      })
    }

    return user
  }

  async login({ auth, request }: HttpContextContract) {
    const username = request.input('username')
    const password = request.input('password')
    const registrationToken = request.input('registrationToken')
    
    const user = await User.findBy('username', username)
    if (user) {
      user.registrationToken = registrationToken
      await user.save()
    }
    
    return auth.use('api').attempt(username, password, {
      expiresIn: '7 days',
    })
  }

  async logout({ auth }: HttpContextContract) {
    const user = await User.findBy("id", auth.user?.id)
  
    if (user){
      user.registrationToken = ''
    }
    return auth.use('api').logout()
  }

  async me({ auth }: HttpContextContract) {
    // Load stuff for the user (maybe post, chats...)
    return auth.user
  }
}
