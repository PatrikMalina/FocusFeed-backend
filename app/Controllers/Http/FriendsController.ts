import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Friend from 'App/Models/Friend'
import User from 'App/Models/User'

export default class FriendsController {
  async myFriends({ auth }: HttpContextContract) {
    return Friend.query()
      .where('sentBy', auth.user!.id)
      .orWhere('sentTo', auth.user!.id)
      .preload('sentByUser')
      .preload('sentToUser')
  }

  async newFriends({ auth, request }: HttpContextContract) {
    const username = request.input('username')
    const page = request.input('page')
    const perPage = request.input('perPage')

    const friends = await Friend.query()
      .where('sentBy', auth.user!.id)
      .orWhere('sentTo', auth.user!.id)

    return User.query()
      .whereNotIn('id', [
        auth.user!.id,
        ...friends.map((friend) => friend.sentBy),
        ...friends.map((friend) => friend.sentTo),
      ])
      .andWhereILike('username', `%${username}%`)
      .paginate(page, perPage)
  }
}
