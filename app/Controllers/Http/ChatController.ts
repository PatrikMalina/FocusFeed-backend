import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository'
import Chat from 'App/Models/Chat'

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

  public async loadMessages({ request }: HttpContextContract) {
    const chatId = request.input('chatId')
    const paging = request.input('paging')
    const perPage = request.input('perPage')
    const offset = request.input('offset')

    return this.messageRepository.getAll(chatId, paging, perPage, offset)
  }
}
