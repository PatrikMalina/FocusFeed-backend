import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Post from 'App/Models/Post'
import User from 'App/Models/User'

export default class InitialSeeder extends BaseSeeder {
  public async run() {
    const user = await User.create({
      username: 'focus-feed',
      email: 'admin@gmail.com',
      password: 'admin1234',
      pictureUrl: 'images/Instagram.png',
    })
    await Post.create({
      caption: 'THE FIRST POST!!!',
      pictureUrl: 'images/first_post.png',
      createdBy: user.id,
    })
  }
}
