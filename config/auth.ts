import { AuthConfig } from '@ioc:Adonis/Addons/Auth'

const authConfig: AuthConfig = {
  guard: 'web',

  guards: {
    web: {
      driver: 'session',

      provider: {
        driver: 'database',
        identifierKey: 'id',
        uids: ['id', 'discord_id'],
        usersTable: 'users',
      },
    },
  },
}

export default authConfig
