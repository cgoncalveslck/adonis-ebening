import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import {
  attachment,
  AttachmentContract,
} from "@ioc:Adonis/Addons/AttachmentLite";

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  // https://lucid.adonisjs.com/docs/serializing-models
  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime) => {
      return value ? value.toLocaleString(DateTime.DATETIME_SHORT, {}) : value;
    },
  })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column()
  public name: string | null;

  @attachment({ preComputeUrl: true })
  public data: AttachmentContract | null;

  @column()
  public type: string | null;

  @column()
  public size: number | string | null;

  @column()
  public url: string | null;

  @column()
  public user_id: number | null;
}
