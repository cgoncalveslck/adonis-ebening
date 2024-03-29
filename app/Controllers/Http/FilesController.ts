import { Attachment } from "@ioc:Adonis/Addons/AttachmentLite";
import { Storage } from "@google-cloud/storage";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import File from "App/Models/File";
import Application from "@ioc:Adonis/Core/Application";
import Database from "@ioc:Adonis/Lucid/Database";
export default class FilesController {
  public async store({ request, response }: HttpContextContract) {
    const requestFile = request.file("new-sound", {
      size: "1mb",
      extnames: ["mp3"],
    });

    if (!requestFile) {
      return response.badRequest("No file was uploaded");
    }

    if (!requestFile.isValid) {
      return response.badRequest(
        requestFile.errors[0].message ?? "Wrong file type or bigger than 1mb",
      );
    }

    const checkExists = await File.findBy("name", requestFile.clientName);
    if (checkExists !== null) {
      return response.badRequest("File already exists");
    }

    //https://v5-docs.adonisjs.com/guides/database/transactions
    //implicitly commits or rollbacks the transaction
    await Database.transaction(async (trx) => {
      const file = new File();
      file.fill({
        name: requestFile.clientName,
        type: requestFile.subtype,
        size: requestFile.size,
        data: Attachment.fromFile(requestFile),
      });
      file.useTransaction(trx);

      // Needed for computed url
      const savedFile = await file.save();

      const relativeTmpPath = savedFile.data?.url;
      if (!relativeTmpPath) return response.badRequest("No file was uploaded");

      // Upload file to GCS
      const uploadResponse = await uploadGCS({
        relativeTmpPath,
        name: savedFile.name,
      });

      savedFile.url = uploadResponse[0].metadata.mediaLink ?? null;
      await savedFile.save();

      //TODO: think i'm supposed to return html here
      // also add alert/toast on success
      return response.ok({ file: requestFile });
    });
  }
}

const uploadGCS = async ({ relativeTmpPath, name }) => {
  const absoluteTmpPath = Application.tmpPath(relativeTmpPath);
  const credsPath = Application.makePath("creds/ebening-creds.json");

  const storage = new Storage({
    keyFilename: credsPath,
    projectId: "ebening",
  });

  const bucketName = "ebening-sounds";

  return await storage.bucket(bucketName).upload(absoluteTmpPath, {
    destination: name,
  });
};
