import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import CreatePostValidator from 'App/Validators/CreatePostValidator'
import path from 'path'
import fs from 'fs';
import User from 'App/Models/User';

export default class PostsController {
  async create({ request, auth }: HttpContextContract) {
    let post
    const user = await User.findBy("id", auth.user?.id)
    try {
        let data = await request.validate(CreatePostValidator)
        const imagePath = path.join('public', 'images', 'post-' + Date.now() + '.jpg')
        const imagePathWithoutPublic = imagePath.replace(/^public\\/, '')
        const base64String = data.picture
        const imageBuffer = Buffer.from(base64String, 'base64')
        const writeStream = fs.createWriteStream(imagePath)
        writeStream.write(imageBuffer)
        writeStream.end()
        post = new Post()
        post.caption = data.caption
        post.pictureUrl = imagePathWithoutPublic
        post.createdBy = user?.id
        await post.save()
    } catch (error) {
      return error
    }
    return post
  }
}



