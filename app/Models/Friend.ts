import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Friend extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sentBy: number

  @column()
  public sentTo: number

  @column()
  public accepted: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
