import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Like from './Like'
import Comment from './Comment'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public createdBy: number

  @column()
  public location: number[]

  @column()
  public caption: string

  @column()
  public pictureUrl: string

  @hasMany(() => Like, {
    foreignKey: 'postId',
  })
  public likes: HasMany<typeof Like>

  @hasMany(() => Comment, {
    foreignKey: 'postId',
  })
  public comments: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
