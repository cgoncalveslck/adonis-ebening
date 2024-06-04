import Route from "@ioc:Adonis/Core/Route";
import Migrator from "@ioc:Adonis/Lucid/Migrator";
import Database from "@ioc:Adonis/Lucid/Database";
import Application from "@ioc:Adonis/Core/Application";

//Auth
Route.get("/", "AuthController.tryLogin");
Route.get("/login", "AuthController.tryLogin");
Route.get("user", "UsersController.show");

Route.get("/logout", async ({ auth, response }) => {
  await auth.use("web").logout();
  response.header("HX-Redirect", "/login");
  response.redirect("/login");
  return response;
});

//Files
Route.post("/upload", "FilesController.store");

// Discord OAuth
Route.get("login/discord", "AuthController.redirectToDiscord");
Route.get("discord/callback", "AuthController.handleDiscordCallback");

// Illegal code, straight to jail
Route.get("/migrate", async ({ view }) => {
  const migrator = new Migrator(Database, Application, {
    direction: "up",
    dryRun: false,
  });

  await migrator.run();

  return view.render("migrate");
});
