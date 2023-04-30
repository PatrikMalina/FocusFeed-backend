import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Chat from 'App/Models/Chat'
import Friend from 'App/Models/Friend'
import User from 'App/Models/User'
import fs from 'fs'

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

  public async updateProfilePicture({ socket, auth }: WsContextContract, picture: string) {
    const user = await User.findBy('id', auth.user?.id)

    if (user != null) {
      const pathToImage = `images/${user.id}/profilePicture.jpg`

      const imageBuffer = Buffer.from(picture, 'base64')

      const writeStream = fs.createWriteStream(pathToImage)
      writeStream.write(`public/${imageBuffer}`)
      writeStream.end()

      user.pictureUrl = pathToImage
      await user.save()

      socket.nsp.emit('updateUser', user)
    }
  }

  public async updateProfileUsername({ socket, auth }: WsContextContract, username: string) {
    const user = await User.findBy('id', auth.user?.id)

    if (user != null) {
      const tempUser = await User.findBy('username', username)

      if (tempUser == null || tempUser.id == auth.user?.id) {
        user.username = username
        await user.save()

        socket.nsp.emit('updateUser', user)
      }
    }
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
