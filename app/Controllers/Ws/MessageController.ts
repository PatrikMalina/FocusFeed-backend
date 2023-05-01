import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import type { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository'
import { inject } from '@adonisjs/core/build/standalone'
import Chat from 'App/Models/Chat'
import User from 'App/Models/User'
import axios from 'axios'


const sendMessageNotification = async (to: string, message: string, title: string, token: string) => {
  const payload = {
    to,
    notification: { title, body: message },
    data: {}
  }
  
  const response = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
    headers: {
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (response.status !== 200) {
    throw new Error('Failed to send notification')
  }
}


@inject(['Repositories/MessageRepository'])
export default class MessageController {
  constructor(private messageRepository: MessageRepositoryContract) {}

  public async addMessage({ params, socket, auth }: WsContextContract, content: string) {
    const message = await this.messageRepository.create(params.chatId, auth.user!.id, content)
    // broadcast message to other users in channel
    socket.broadcast.emit('message', message)

    const chat = await Chat.query()
      .where('id', params.chatId)
      .firstOrFail()

    const otherUserId = chat.user1 === auth.user!.id ? chat.user2 : chat.user1

    const otherUser = await User.findBy('id', otherUserId)
    if(otherUser) {
      const notificationToken = otherUser.registrationToken
      const messageText = `New message from ${auth.user!.username}`
      const title = `FocusFeed`
      const authorizationToken = 'key=AAAA8lDsSsI:APA91bGTC0FzmLknQi3IQn9lhzxG4yqqVZ3h_X3fnOUvxd29K6GR9K4Dt-pbvpMT0Nbor5jrz13sHLDtFe16nvzBjs5ftuZW3wkpNyxr7HclnPhQJ73P4V1dme2KS8XPZGYcG7qLUac8'

      await sendMessageNotification(notificationToken, messageText, title, authorizationToken)
    }
    // return message to sender
    return message
  }
}
