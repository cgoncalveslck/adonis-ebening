import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view, response }) => {
  try {
    response.redirect('/user')
  } catch (error) {
    return view.render('login')
  }
})

Route.get('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  response.redirect('/')
})

Route.get('/login', async ({ view }) => {
  return view.render('login')
})

Route.post('/upload', 'FilesController.store')

Route.get('user', 'UsersController.show')
Route.get('login/discord', 'AuthController.redirectToDiscord')
Route.get('discord/callback', 'AuthController.handleDiscordCallback')
