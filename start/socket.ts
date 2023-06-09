/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'

Ws.namespace('/')
  .connected('ActivityController.onConnected')
  .disconnected('ActivityController.onDisconnected')
  .on('friendRequest', 'ActivityController.friendRequest')
  .on('updateFriendRequest', 'ActivityController.updateFriendRequest')
  .on('createChat', 'ActivityController.createChat')

Ws.namespace('chats/:chatId').on('addMessage', 'MessageController.addMessage')
