import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Friend extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sentBy: number

  @belongsTo(() => User, {
    foreignKey: 'sentBy',
  })
  public sentByUser: BelongsTo<typeof User>

  @column()
  public sentTo: number

  @belongsTo(() => User, {
    foreignKey: 'sentTo',
  })
  public sentToUser: BelongsTo<typeof User>

  @column()
  public accepted: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
