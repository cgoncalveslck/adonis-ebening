import File from "App/Models/File";
export default class UsersController {
  async show({ auth, view }) {
    await auth.use("web").authenticate();
    //TODO: move this elsewhere and maybe paginate (?)
    const Allfiles = await File.all();

    // https://lucid.adonisjs.com/docs/serializing-models yuck
    const files = Allfiles.map((file) => file.serialize());

    return view.render("user", { user: auth.user, files });
  }
}
