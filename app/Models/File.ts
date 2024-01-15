import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import {
  attachment,
  AttachmentContract,
} from "@ioc:Adonis/Addons/AttachmentLite";

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column.dateTime({ autoCreate: true })
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
  public size: number | null;

  @column()
  public user_id: number | null;
}
