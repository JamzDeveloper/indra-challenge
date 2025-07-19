import { DynamoService } from "../../../src/infrastructure/dynamodb/dynamo.service";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  BatchGetCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("@aws-sdk/lib-dynamodb", () => {
  const original = jest.requireActual("@aws-sdk/lib-dynamodb");
  return {
    ...original,
    DynamoDBDocumentClient: {
      from: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue({}),
      }),
    },
    PutCommand: jest.fn(),
    GetCommand: jest.fn(),
    UpdateCommand: jest.fn(),
    DeleteCommand: jest.fn(),
    QueryCommand: jest.fn(),
    ScanCommand: jest.fn(),
    BatchGetCommand: jest.fn(),
    BatchWriteCommand: jest.fn(),
  };
});

describe("DynamoService", () => {
  let service: DynamoService;

  beforeEach(() => {
    service = new DynamoService();
  });

  it("should call put with PutCommand", async () => {
    await service.put({ TableName: "test", Item: {} });
    expect(PutCommand).toHaveBeenCalled();
  });

  it("should call get with GetCommand", async () => {
    await service.get({ TableName: "test", Key: {} });
    expect(GetCommand).toHaveBeenCalled();
  });

  it("should call update with UpdateCommand", async () => {
    await service.update({ TableName: "test", Key: {}, UpdateExpression: "" });
    expect(UpdateCommand).toHaveBeenCalled();
  });

  it("should call delete with DeleteCommand", async () => {
    await service.delete({ TableName: "test", Key: {} });
    expect(DeleteCommand).toHaveBeenCalled();
  });

  it("should call query with QueryCommand", async () => {
    await service.query({ TableName: "test", KeyConditionExpression: "" });
    expect(QueryCommand).toHaveBeenCalled();
  });

  it("should call scan with ScanCommand", async () => {
    await service.scan({ TableName: "test" });
    expect(ScanCommand).toHaveBeenCalled();
  });

  it("should call batchGet with BatchGetCommand", async () => {
    await service.batchGet({ RequestItems: {} });
    expect(BatchGetCommand).toHaveBeenCalled();
  });

  it("should call batchWrite with BatchWriteCommand", async () => {
    await service.batchWrite({ RequestItems: {} });
    expect(BatchWriteCommand).toHaveBeenCalled();
  });
});
