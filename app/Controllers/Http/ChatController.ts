import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Chat from 'App/Models/Chat'
import Message from 'App/Models/Message'

export default class ChatController {
  async myChats({ auth }: HttpContextContract) {
    return Chat.query()
      .where('user1', auth.user!.id)
      .orWhere('user2', auth.user!.id)
      .preload('user_1')
      .preload('user_2')
  }

  async lastMessage({ request }: HttpContextContract) {
    const chatId = request.input('chatId')

    return Message.query()
      .where('chat_id', chatId)
      .orderBy('created_at', 'desc')
      .preload('author')
      .first()
  }
}
