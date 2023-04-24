import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreatePostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    caption: schema.string({ trim: true, escape: true }, [rules.required(), rules.maxLength(280)]),
    picture: schema.string({}, [rules.required()]),
    latitude: schema.number.optional(),
    longitude: schema.number.optional(),
  })

  public messages = {
    'location.minLength': 'The location must have at least 2 coordinates.',
    'location.*.range': 'The coordinates must be between -90 and 90 for latitude and -180 and 180 for longitude.',
    'caption.required': 'The caption is required.',
    'caption.maxLength': 'The caption must not be longer than 280 characters.',
    'picture.required': 'The picture URL is required.'
  }
}