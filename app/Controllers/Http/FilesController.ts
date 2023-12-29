import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'

export default class FilesController {
  public async store({ request, response }: HttpContextContract) {
    const bufferFile = request.file('file')

    if (!bufferFile) {
      return response.badRequest('No file was uploaded')
    }

    const file = new File()
    file.data = Attachment.fromFile(bufferFile)

    file.fill({
      name: bufferFile.fileName,
      type: bufferFile.type,
      size: bufferFile.size,
    })

    await file.save()
  }
}
