import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Chat from 'App/Models/Chat'
import Friend from 'App/Models/Friend'
import User from 'App/Models/User'
import axios from 'axios'
import fs from 'fs'


const sendNewFriendNotification = async (to: string, message: string, title: string, token: string) => {
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

  console.log(response);
  
}

export default class ActivityController {
  constructor() {}

  private getUserRoom(user: User): string {
    return `user:${user.id}`
  }

  public async onConnected({ socket, auth, logger }: WsContextContract) {
    // all connections for the same authenticated user will be in the room
    const room = this.getUserRoom(auth.user!)
    const userSockets = await socket.in(room).allSockets()

    // this is first connection for given user
    if (userSockets.size === 0) {
      socket.broadcast.emit('user:online', auth.user)
    }

    // add this socket to user room
    socket.join(room)
    // add userId to data shared between Socket.IO servers
    // https://socket.io/docs/v4/server-api/#namespacefetchsockets
    socket.data.userId = auth.user!.id

    const allSockets = await socket.nsp.except(room).fetchSockets()
    const onlineIds: number[] = []

    for (const remoteSocket of allSockets) {
      const userId = remoteSocket.data.userId
      onlineIds.push(userId)
    }

    socket.emit('user:list', onlineIds)

    logger.info('new websocket connection')
  }

  // see https://socket.io/get-started/private-messaging-part-2/#disconnection-handler
  public async onDisconnected({ socket, auth, logger }: WsContextContract, reason: string) {
    const room = this.getUserRoom(auth.user!)
    const userSockets = await socket.in(room).allSockets()

    // user is disconnected
    if (userSockets.size === 0) {
      // notify other users
      socket.broadcast.emit('user:offline', auth.user)
    }

    logger.info('websocket disconnected', reason)
  }

  public async friendRequest({ socket, auth }: WsContextContract, userId: number) {
    const data = { sentBy: auth.user!.id, sentTo: userId, accepted: 0 }
    await Friend.create(data)

    const friend = await Friend.query()
      .where('sentBy', auth.user!.id)
      .andWhere('sentTo', userId)
      .preload('sentByUser')
      .preload('sentToUser')
      .first()

    if (friend) {
      socket.nsp.emit('friendRequest', friend)

      const otherUser = await User.findBy('id', userId)
      if(otherUser) {
        const notificationToken = otherUser.registrationToken
        const messageText = `New friend request from ${auth.user!.username}`
        const title = `FocusFeed`
        const authorizationToken = 'key=AAAA8lDsSsI:APA91bGTC0FzmLknQi3IQn9lhzxG4yqqVZ3h_X3fnOUvxd29K6GR9K4Dt-pbvpMT0Nbor5jrz13sHLDtFe16nvzBjs5ftuZW3wkpNyxr7HclnPhQJ73P4V1dme2KS8XPZGYcG7qLUac8'
  
        await sendNewFriendNotification(notificationToken, messageText, title, authorizationToken)
      }

      return friend
    }
    return false
  }

  public async updateFriendRequest({ socket }: WsContextContract, id: number, status: number) {
    const friend = await Friend.query()
      .where('id', id)
      .preload('sentByUser')
      .preload('sentToUser')
      .first()

    if (friend) {
      friend.accepted = status
      await friend.save()

      socket.nsp.emit('updateFriendRequest', friend)
      return friend
    }
    return false
  }

  public async createChat({ socket, auth }: WsContextContract, userId: number) {
    const temp = await Chat.create({
      user1: auth.user!.id,
      user2: userId,
    })

    if (!temp) return false

    const chat = await Chat.query()
      .where('user1', auth.user!.id)
      .andWhere('user2', userId)
      .preload('user_1')
      .preload('user_2')
      .first()

    if (chat) {
      socket.nsp.emit('createChat', chat)
      return chat
    }
    return false
  }
}
