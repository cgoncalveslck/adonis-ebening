import Route from "@ioc:Adonis/Core/Route";
import Migrator from "@ioc:Adonis/Lucid/Migrator";
import Database from "@ioc:Adonis/Lucid/Database";
import Application from "@ioc:Adonis/Core/Application";
import { Storage } from "@google-cloud/storage";
import File from "App/Models/File";

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
Route.get("/migrate", async () => {
  const migrator = new Migrator(Database, Application, {
    direction: "up",
    dryRun: false,
  });

  await migrator.run();

  const credsPath = Application.makePath("creds/ebening-creds.json");
  // Sync files in GCS with DB
  const storage = new Storage({
    keyFilename: credsPath,
    projectId: "ebening",
  });

  await storage
    .bucket("ebening-sounds")
    .getFiles()
    .then(async (files) => {
      const newFile = files[0].map((gcs_file) => {
        return {
          name: gcs_file.name,
          url: gcs_file.metadata.mediaLink,
          type: gcs_file.metadata.contentType,
          size: gcs_file.metadata.size,
        };
      });

      await File.updateOrCreateMany("name", newFile);
      // for (const gcs_file of files[0]) {
      // const name = gcs_file.name;
      // const checkExists = await Database.from("files").where("name", name);
      // if (checkExists.length === 0) {
      //   const newFile = new File();
      //   newFile.fill({
      //     name: name,
      //     url: gcs_file.metadata.mediaLink,
      //     type: gcs_file.metadata.contentType,
      //     size: gcs_file.metadata.size,
      //   });
      //   await newFile.save();
      // }
      // }
    });

  return "Migration complete";
});
