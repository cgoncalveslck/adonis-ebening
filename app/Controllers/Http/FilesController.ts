import { Attachment } from "@ioc:Adonis/Addons/AttachmentLite";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import File from "App/Models/File";
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
      await file.save();

      const tableRowHtml = `
          <tr class="border-b border-white/5">
            <td class="p-2 align-middle">${file.name}</td>
            <td class="p-2 align-middle">
            0
            </td>
            <td class="p-2 align-middle">${file.createdAt}</td>
            <td class="p-2 align-middle">
              <audio preload="metadata" controls class="w-full">
                <source src="${await file.data?.url}" type="audio/mpeg" />
              </audio>
            </td>
          </tr>
        `;

      return response.ok(tableRowHtml);
    });
  }
}
