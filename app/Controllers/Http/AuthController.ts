import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async redirectToDiscord({ ally }: HttpContextContract) {
    await ally.use('discord').redirect()
  }

  public async handleDiscordCallback({ ally, auth, response }: HttpContextContract) {
    try {
      const discord = await ally.use('discord')
      // console.log(discord)

      if (discord.accessDenied()) {
        return 'Access was denied'
      }

      if (discord.stateMisMatch()) {
        return 'Request expired. Retry again'
      }
      if (discord.hasError()) {
        return discord.getError()
      }

      const discordUser = await discord.user()
      const user = await User.firstOrCreate(
        {
          email: discordUser.email,
        },
        {
          name: discordUser.name,
          accessToken: discordUser.token.token,
        }
      )

      console.log(user, 'user')

      await auth.use('web').login(user)

      return response.redirect('/')
    } catch (error) {
      throw error
    }
  }
}
