import { Sequelize } from "sequelize";
import {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_POOL,
  DB_USER,
} from "../config";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  pool: DB_POOL,
});

interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
}

export const db: Database = { Sequelize, sequelize };
