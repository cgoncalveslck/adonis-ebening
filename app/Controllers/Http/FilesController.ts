import { Attachment } from "@ioc:Adonis/Addons/AttachmentLite";
import { Storage } from "@google-cloud/storage";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import File from "App/Models/File";
import Application from "@ioc:Adonis/Core/Application";

export default class FilesController {
  public async store({ request, response }: HttpContextContract) {
    const requestFile = request.file("file");

    if (!requestFile) {
      return response.badRequest("No file was uploaded");
    }

    //Save file to db
    const file = new File();
    file.fill({
      name: requestFile.clientName,
      type: requestFile.subtype,
      size: requestFile.size,
      data: Attachment.fromFile(requestFile),
    });
    const savedFile = await file.save();

    const relativeTmpPath = savedFile.data?.url;
    if (!relativeTmpPath) return response.badRequest("No file was uploaded");

    //Upload file to GCS
    await uploadGCS({ relativeTmpPath, name: savedFile.name });

    // Update file in db with url here
    // find a way to not make 3 trips db -> gcs -> db

    return response.ok(requestFile);
  }
}

const uploadGCS = async ({ relativeTmpPath, name }) => {
  const absoluteTmpPath = Application.tmpPath(relativeTmpPath);
  const credsPath = Application.makePath("creds/ebening-aeebdfe49c83.json");

  const storage = new Storage({
    keyFilename: credsPath,
    projectId: "ebening",
  });

  const bucketName = "ebening-sounds";

  const response = await storage.bucket(bucketName).upload(absoluteTmpPath, {
    destination: name,
  });
  console.log(response, "response");
};
