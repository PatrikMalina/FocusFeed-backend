import type {
  MessageRepositoryContract,
  SerializedMessage,
} from '@ioc:Repositories/MessageRepository'
import Chat from 'App/Models/Chat'
import Message from 'App/Models/Message'

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(
    chatId: number,
    paging: number,
    perPage: number
  ): Promise<SerializedMessage[]> {
    const messages = await Message.query()
      .where('chatId', chatId)
      .orderBy('createdAt', 'desc')
      .paginate(paging, perPage)

    return messages
      .all()
      .map((message) => message.serialize() as SerializedMessage)
      .reverse()
  }

  public async create(
    chatId: number,
    userId: number,
    content: string
  ): Promise<SerializedMessage | null> {
    const chat = await Chat.findBy('chatId', chatId)

    if (!chat) {
      return null
    }

    const message = await chat.related('messages').create({ createdBy: userId, content })

    return message.serialize() as SerializedMessage
  }
}
