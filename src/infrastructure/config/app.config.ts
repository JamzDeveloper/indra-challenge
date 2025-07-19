export const appConfig = {
  region: process.env.AWS_REGION || "us-east-1",
  tableName: process.env.DYNAMO_TABLE_NAME || "AppointmentsTable",
  mysqlPe: {
    host: process.env.RDS_PE_HOST,
    user: process.env.RDS_PE_USER,
    port: process.env.RDS_PE_PORT,
    password: process.env.RDS_PE_PASSWORD,
    database: process.env.RDS_PE_DB,
  },
  mysqlCl: {
    host: process.env.RDS_CL_HOST,
    user: process.env.RDS_CL_USER,
    port: process.env.RDS_CL_PORT,
    password: process.env.RDS_CL_PASSWORD,
    database: process.env.RDS_CL_DB,
  },

  eventBridge: {
    bus: process.env.EVENT_BRIDGE_BUS || "default",
    detailType: process.env.EVENT_BRIDGE_DETAIL_TYPE || "",
  },
};
