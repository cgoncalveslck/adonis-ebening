// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  async show({ auth, view }) {
    await auth.use('web').authenticate()
    return view.render('user', { user: auth.user })
  }
}
