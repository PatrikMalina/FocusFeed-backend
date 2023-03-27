import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Message from './Message'

export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => User)
  public user1: HasOne<typeof User>

  @hasOne(() => User)
  public user2: HasOne<typeof User>

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
