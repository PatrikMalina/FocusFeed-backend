import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Friend extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => User)
  public sentBy: HasOne<typeof User>

  @hasOne(() => User)
  public sentTo: HasOne<typeof User>

  @column()
  public accepted: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
