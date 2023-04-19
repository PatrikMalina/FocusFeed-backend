import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository'
import Chat from 'App/Models/Chat'
import Message from 'App/Models/Message'

@inject(['Repositories/MessageRepository'])
export default class ChatController {
  constructor(private messageRepository: MessageRepositoryContract) {}

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

  public async loadMessages({ request }: HttpContextContract) {
    const chatId = request.input('chatId')
    const paging = request.input('paging')
    const perPage = request.input('perPage')

    return this.messageRepository.getAll(chatId, paging, perPage)
  }
}
