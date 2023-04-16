import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'
import User from './User'

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user1: number

  @column()
  public user2: number

  @hasMany(() => Message, {
    foreignKey: 'chatId',
  })
  public messages: HasMany<typeof Message>

  @column.dateTime()
  public lastRead: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user1',
  })
  public user_1: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'user2',
  })
  public user_2: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
