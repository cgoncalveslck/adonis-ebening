import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  public async up() {
    this.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("name").nullable().unique();
      table.string("nick_name").nullable();
      table.jsonb("discord_token").nullable();
      table.string("discord_id").nullable();
      table.string("discord_avatar_url").nullable();

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).notNullable();
      table.timestamp("updated_at", { useTz: true }).notNullable();
    });

    this.schema.createTable("files", (table) => {
      table.increments("id").primary();
      table.json("data").nullable();
      table.string("name").notNullable();
      table.string("type", 20).nullable();
      table.integer("size").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .nullable();

      table.string("url").nullable();
      table.timestamp("created_at", { useTz: true }).notNullable();
      table.timestamp("updated_at", { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable("users");
    this.schema.dropTable("files");
  }
}
