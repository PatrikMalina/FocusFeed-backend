import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
  //  */
  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(30),
      rules.unique({ table: 'users', column: 'username', caseInsensitive: false }),
    ]),
    email: schema.string({ trim: true }, [
      rules.email({ ignoreMaxLength: false }),
      rules.trim(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
    ]),
    password: schema.string({}, [
      rules.minLength(8),
      rules.maxLength(64),
      rules.confirmed('passwordConfirmation'),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'username.unique': 'This Username is already taken!',
    'email.unique': `The Email address you've entered is assigned to an existing account!`,
    'minLength': 'The {{field}} must be at least {{options.minLength }} characters long!',
    'maxLength': 'The {{field}} must be less then {{options.maxLength }} characters long!',
    'email': 'The Email is not in the correct format!',
    'confirmed': 'The passwords do not match!',
  }
}
