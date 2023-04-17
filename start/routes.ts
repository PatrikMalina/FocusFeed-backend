/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.get('me', 'AuthController.me').middleware('auth')
}).prefix('auth')

Route.group(() => {
  Route.get('', 'ChatController.myChats')
  Route.post('lastMessage', 'ChatController.lastMessage')
})
  .prefix('chat')
  .middleware('auth')

Route.get('', 'FriendsController.myFriends').prefix('friends').middleware('auth')

Route.group(() => {
  Route.post('create', 'PostController.create')
  Route.delete('delete', 'PostController.delete')
  Route.get('myposts', 'PostController.myPosts')
  Route.post('comment', 'PostController.addComment')
  Route.post('like', 'PostController.addLike')
})
  .prefix('post')
  .middleware('auth')

Route.put('updateEmail', 'UserController.updateProfileEmail').prefix('user').middleware('auth')
