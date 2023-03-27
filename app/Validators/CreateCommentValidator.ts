import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateCommentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    text: schema.string({ trim: true, escape: true }, [rules.required(), rules.maxLength(120)]),
    id: schema.number([rules.required()])
  })

  public messages = {
    'text.required': 'The caption is required.',
    'text.maxLength': 'The caption must not be longer than 120 characters.',
    'id.required': 'The id is required'
  }
}