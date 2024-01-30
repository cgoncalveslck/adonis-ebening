import Route from "@ioc:Adonis/Core/Route";

//Auth
Route.get("/", "AuthController.tryLogin");
Route.get("/login", "AuthController.tryLogin");
Route.get("user", "UsersController.show");

Route.get("/logout", async ({ auth, response }) => {
  await auth.use("web").logout();
  response.redirect("/");
});

//Files
Route.post("/upload", "FilesController.store");

// Discord OAuth
Route.get("login/discord", "AuthController.redirectToDiscord");
Route.get("discord/callback", "AuthController.handleDiscordCallback");
