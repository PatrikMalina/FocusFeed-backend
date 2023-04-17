import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Friend from 'App/Models/Friend'

export default class FriendsController {
  async myFriends({ auth }: HttpContextContract) {
    return Friend.query()
      .where('sentBy', auth.user!.id)
      .orWhere('sentTo', auth.user!.id)
      .preload('sentByUser')
      .preload('sentToUser')
  }
}
