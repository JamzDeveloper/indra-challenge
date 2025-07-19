import { DynamoPrefix } from "../../../src/domain/constants/dynamo-prefix.enum";
import { Schedule } from "../../../src/domain/entities/schedule.entity";
import { appConfig } from "../../../src/infrastructure/config/app.config";
import { DynamoService } from "../../../src/infrastructure/dynamodb/dynamo.service";
import { DynamoScheduleRepository } from "../../../src/infrastructure/repositories/schedule-dynamo.repository";

jest.mock("../../../src/infrastructure/dynamodb/dynamo.service");

describe("DynamoScheduleRepository", () => {
  let repository: DynamoScheduleRepository;
  let dynamoService: jest.Mocked<DynamoService>;

  const mockSchedule = new Schedule({
    scheduleId: 100,
    date: new Date("2024-09-30T12:30:00Z"),
    centerId: 4,
    medicId: 50,
    specialtyId: 49,
  });

  beforeEach(() => {
    dynamoService = {
      put: jest.fn(),
      scan: jest.fn(),
    } as unknown as jest.Mocked<DynamoService>;

    repository = new DynamoScheduleRepository(dynamoService);
  });

  describe("save", () => {
    it("should call dynamoService.put with correct parameters", async () => {
      await repository.save(mockSchedule);

      expect(dynamoService.put).toHaveBeenCalledWith({
        TableName: appConfig.tableName,
        Item: mockSchedule.toItem(),
      });
    });
  });

  describe("listAvailable", () => {
    it("should return mapped Schedule entities from scan results", async () => {
      const mockItem = mockSchedule.toItem();

      dynamoService.scan.mockResolvedValue({
        Items: [mockItem],
        $metadata: {},
      });

      const result = await repository.listAvailable();

      expect(dynamoService.scan).toHaveBeenCalledWith({
        TableName: appConfig.tableName,
        FilterExpression: "SK = :sk AND itemType = :itemType",
        ExpressionAttributeValues: {
          ":sk": `${DynamoPrefix.SCHEDULE}#${DynamoPrefix.DETAILS}`,
          ":itemType": `${DynamoPrefix.SCHEDULE}`,
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Schedule);
      expect(result[0].scheduleId).toBe(mockSchedule.scheduleId);
    });

    it("should return an empty array if no items are found", async () => {
      dynamoService.scan.mockResolvedValue({ Items: [], $metadata: {} });

      const result = await repository.listAvailable();

      expect(result).toEqual([]);
    });
  });
});
