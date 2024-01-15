// import File from "App/Models/File";
export default class UsersController {
  async show({ auth, view }) {
    await auth.use("web").authenticate();

    // //tmp fix for listing files
    // const files = await File.all();

    return view.render("user", { user: auth.user });
  }
}
