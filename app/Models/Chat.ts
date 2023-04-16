import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
