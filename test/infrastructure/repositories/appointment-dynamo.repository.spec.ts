import { DynamoPrefix } from "../../../src/domain/constants/dynamo-prefix.enum";
import { Appointment } from "../../../src/domain/entities/appointment.entity";
import { DynamoService } from "../../../src/infrastructure/dynamodb/dynamo.service";
import { DynamoAppointmentRepository } from "../../../src/infrastructure/repositories/appointment-dynamo.repository";

const mockDynamoService = {
  put: jest.fn(),
  query: jest.fn(),
  update: jest.fn(), 
};

const appointmentProps = {
  appointmentId: "7e609456-2eee-4f53-95e7-80dae3e5dbaf",
  insuredId: "98909",
  date: new Date().toISOString(),
  description: "Consulta general",
};

const appointmentEntity = new Appointment({
  ...appointmentProps,
  scheduleId: 100,
  countryISO: "PE",
});

jest.mock("../../../src/infrastructure/config/app.config", () => ({
  appConfig: {
    tableName: "AppointmentsTable",
  },
}));

describe("DynamoAppointmentRepository", () => {
  let repository: DynamoAppointmentRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new DynamoAppointmentRepository(
      mockDynamoService as unknown as DynamoService
    );
  });

  describe("save", () => {
    it("should call dynamoService.put with correct parameters", async () => {
      const mockItem = appointmentEntity.toItem();

      await repository.save(appointmentEntity);

      expect(mockDynamoService.put).toHaveBeenCalledWith({
        TableName: "AppointmentsTable",
        Item: mockItem,
      });
    });
  });

  describe("getByInsuredId", () => {
    it("should return a list of appointments from dynamo", async () => {
      const mockItem = appointmentEntity.toItem();
      mockDynamoService.query.mockResolvedValue({
        Items: [mockItem],
        $metadata: {},
      });

      const result = await repository.getByInsuredId("insured-1");

      expect(mockDynamoService.query).toHaveBeenCalledWith({
        TableName: "AppointmentsTable",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `${DynamoPrefix.INSURED}#insured-1`,
          ":sk": `${DynamoPrefix.APPOINTMENT}#`,
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Appointment);
      expect(result[0].appointmentId).toEqual(
        "7e609456-2eee-4f53-95e7-80dae3e5dbaf"
      );
    });

    it("should return an empty array if no items found", async () => {
      mockDynamoService.query.mockResolvedValue({
        Items: [],
        $metadata: {},
      });

      const result = await repository.getByInsuredId("insured-1");

      expect(result).toEqual([]);
    });
  });
  describe("updateStatus", () => {
    it("should update the appointment status in DynamoDB", async () => {
      const appointmentId = "7e609456-2eee-4f53-95e7-80dae3e5dbaf";
      const insuredId = "98909";
      const status = "CANCELLED";

      await repository.updateStatus(appointmentId, status, insuredId);
      expect(mockDynamoService.update).toHaveBeenCalledWith({
        TableName: "AppointmentsTable",
        Key: {
          PK: `${DynamoPrefix.INSURED}#${insuredId}`,
          SK: `${DynamoPrefix.APPOINTMENT}#${appointmentId}`,
        },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": status,
        },
      });
    });
  });
});
