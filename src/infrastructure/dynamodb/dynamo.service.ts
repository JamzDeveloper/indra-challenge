import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  BatchGetCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { appConfig } from "../config/app.config";

export class DynamoService {
  private readonly docClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({ region: appConfig.region });

    this.docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  getClient(): DynamoDBDocumentClient {
    return this.docClient;
  }

  async put(params: any) {
    return this.docClient.send(new PutCommand(params));
  }

  async get(params: any) {
    return this.docClient.send(new GetCommand(params));
  }

  async update(params: any) {
    return this.docClient.send(new UpdateCommand(params));
  }

  async delete(params: any) {
    return this.docClient.send(new DeleteCommand(params));
  }

  async query(params: any) {
    return this.docClient.send(new QueryCommand(params));
  }

  async scan(params: any) {
    return this.docClient.send(new ScanCommand(params));
  }

  async batchGet(params: any) {
    return this.docClient.send(new BatchGetCommand(params));
  }

  async batchWrite(params: any) {
    return this.docClient.send(new BatchWriteCommand(params));
  }
}
