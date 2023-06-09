import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import CreatePostValidator from 'App/Validators/CreatePostValidator'
import path from 'path'
import fs from 'fs';
import User from 'App/Models/User';
import Comment from 'App/Models/Comment';
import CreateCommentValidator from 'App/Validators/CreateCommentValidator';
import Like from 'App/Models/Like';

export default class PostsController {
  async create({ request, auth, response }: HttpContextContract) {
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
        if (data.latitude && data.longitude){
          post.location = `(${data.latitude},${data.longitude})`
        }
        await post.save()
    } catch (error) {
      return error
    }
    return response.status(201).json({
        message: 'Post added successfully',
        data: post
      })
  }

  async delete({ auth, response, params }: HttpContextContract) {
    const postId = params.id
    const post = await Post.find(postId)

    if (!post) {
      return response.status(404).json({ error: 'Post not found' })
    }

    if (post.createdBy !== auth.user?.id) {
        return response.status(403).json({ error: 'Forbidden' })
    }

    await post.delete()

    return response.status(204)
  }

  async myPosts({ auth }: HttpContextContract) {
    const user = await User.findBy("id", auth.user?.id)
    const posts = await Post.query().where('createdBy', user!.id).preload('comments').preload('likes').orderBy('created_at', 'desc')
    return posts
  }

  async allPosts({ }: HttpContextContract) {
    const posts = await Post.query()
      .join('users', 'posts.created_by', 'users.id')
      .select('posts.*', 'users.username as createdByUsername', 'users.picture_url as profilePictureUrl')
      .preload('comments', (query) => {
        query
          .join('users', 'comments.user_id', 'users.id')
          .select('comments.*', 'users.username as commentByUsername', 'users.picture_url as commentProfilePictureUrl')
      })
      .preload('likes')
      .orderBy('created_at', 'desc')
  
    const postsWithExtras = posts.map(post => {
      const { createdByUsername, profilePictureUrl } = post.$extras
      const commentsWithExtras = post.comments.map(comment => {
        const { commentByUsername, commentProfilePictureUrl } = comment.$extras
        return { ...comment.toJSON(), commentByUsername, commentProfilePictureUrl }
      })
      return { ...post.toJSON(), createdByUsername, profilePictureUrl, comments: commentsWithExtras }
    })
  
    return postsWithExtras
  }

  async postById({ params }: HttpContextContract) {
    const postId = params.id
    const posts = await Post.query()
      .where('posts.id', postId)
      .join('users', 'posts.created_by', 'users.id')
      .select('posts.*', 'users.username as createdByUsername', 'users.picture_url as profilePictureUrl')
      .preload('comments', (query) => {
        query
          .join('users', 'comments.user_id', 'users.id')
          .select('comments.*', 'users.username as commentByUsername', 'users.picture_url as commentProfilePictureUrl')
      })
      .preload('likes')
  
    const postsWithExtras = posts.map(post => {
      const { createdByUsername, profilePictureUrl } = post.$extras
      const commentsWithExtras = post.comments.map(comment => {
        const { commentByUsername, commentProfilePictureUrl } = comment.$extras
        return { ...comment.toJSON(), commentByUsername, commentProfilePictureUrl }
      })
      return { ...post.toJSON(), createdByUsername, profilePictureUrl, comments: commentsWithExtras }
    })
  
    return postsWithExtras
  }

  public async addComment({ request, auth, response }: HttpContextContract) {
    let comment
    try {
        let data = await request.validate(CreateCommentValidator)
        const post = await Post.find(data.id)
        if (!post) {
            return response.status(404).json({ error: 'Post not found' })
          }
        comment = await Comment.create({
            comment: data.text,
            userId: auth.user?.id,
            postId: post.id
        })
        return response.status(201).json({
        message: 'Comment added successfully',
        data: comment
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Unable to add comment',
        error: error.message,
      })
    }
  }

  public async addLike({ request, auth, response }: HttpContextContract) {
    let like
    try {
        const post = await Post.find(request.input('id'))
        if (!post) {
            return response.status(404).json({ error: 'Post not found' })
          }
        const existingLike = await Like.query().where('userId', auth.user!.id).where('postId', post.id).first()
    
        if (existingLike) {
            return response.status(409).json({ error: 'You have already liked this post' })
          }

        like = await Like.create({
            userId: auth.user?.id,
            postId: post.id
        })
        return response.status(201).json({
        message: 'Like added successfully',
        data: like
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Unable to add like',
        error: error.message,
      })
    }
  }

}



