import mysql from "mysql2/promise";
import { appConfig } from "../config/app.config";
export const poolCL = mysql.createPool({
  host: appConfig.mysqlCl.host,
  port: Number(appConfig.mysqlCl.port),
  user: appConfig.mysqlCl.user,
  password: appConfig.mysqlCl.password,
  database: appConfig.mysqlCl.database,
});
