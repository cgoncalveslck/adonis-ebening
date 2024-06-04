import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  public async redirectToDiscord({ ally }: HttpContextContract) {
    await ally.use("discord").redirect();
  }

  public async handleDiscordCallback({
    ally,
    auth,
    response,
  }: HttpContextContract) {
    const discord = await ally.use("discord");
    if (discord.accessDenied()) {
      return "Access was denied";
    }

    if (discord.stateMisMatch()) {
      // this "fixed" something but I don't remember what
      return response.redirect("/logout");
    }

    if (discord.hasError()) {
      return discord.getError();
    }

    const discordUser = await discord.user();
    const user = await User.updateOrCreate(
      {
        name: discordUser.name,
      },
      {
        discord_id: discordUser.id,
        name: discordUser.name,
        nick_name: discordUser.original.global_name ?? discordUser.nickName,
        discord_token: discordUser.token,
        discord_avatar_url: discordUser.avatarUrl,
      },
    );

    await auth.use("web").login(user);
    return response.redirect("/user");
  }

  // TODO: redo the whole login flow
  public async tryLogin({ response, auth, view }: HttpContextContract) {
    try {
      await auth.use("web").authenticate();
    } catch {
      return view.render("login");
    }
    return response.redirect("/user");
  }
}
