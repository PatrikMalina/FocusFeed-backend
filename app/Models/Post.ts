import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Like from './Like'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => User)
  public createdBy: HasOne<typeof User>

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
