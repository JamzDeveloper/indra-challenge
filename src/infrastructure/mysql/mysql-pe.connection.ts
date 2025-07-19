import mysql from "mysql2/promise";
import { appConfig } from "../config/app.config";

export const poolPE = mysql.createPool({
  host: appConfig.mysqlPe.host,
  user: appConfig.mysqlPe.user,
  port: Number(appConfig.mysqlPe.port),
  password: appConfig.mysqlPe.password,
  database: appConfig.mysqlPe.database,
});
