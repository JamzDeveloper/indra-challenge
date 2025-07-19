import {
  APIGatewayProxyEvent,
  SQSEvent,
  SQSRecordAttributes,
} from "aws-lambda";
import { appConfig } from "../../../src/infrastructure/config/app.config";
jest.mock("../../../src/infrastructure/dynamodb/dynamo.service");
jest.mock("../../../src/infrastructure/sns/sns-notification.service");

const mockGetByInsuredId = jest.fn();
const mockSave = jest.fn();
const mockUpdateStatus = jest.fn();

jest.mock(
  "../../../src/infrastructure/repositories/appointment-dynamo.repository",
  () => ({
    DynamoAppointmentRepository: jest.fn().mockImplementation(() => ({
      getByInsuredId: mockGetByInsuredId,
      save: mockSave,
      updateStatus: mockUpdateStatus,
    })),
  })
);
import { handler } from "../../../src/interfaces/handlers/appointment-handler";

describe("Appointment Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and appointments for valid insuredId", async () => {
    mockGetByInsuredId.mockResolvedValue([
      {
        appointmentId: "1",
        insuredId: "123",
        date: new Date().toISOString(),
        description: "Consulta general",
        scheduleId: 999,
        countryISO: "PE",
      },
    ]);

    const event: Partial<APIGatewayProxyEvent> = {
      httpMethod: "GET",
      path: "/appointments/{insuredId}",
      resource: "/appointments/{insuredId}",
      pathParameters: { insuredId: "123" },
    };

    const response = await handler(event as APIGatewayProxyEvent);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty("data");
    expect(JSON.parse(response.body).message).toBe(
      "Citas obtenidas correctamente"
    );
  });

  it("should return 400 if insuredId is missing", async () => {
    const event: Partial<APIGatewayProxyEvent> = {
      httpMethod: "GET",
      path: "/appointments/{insuredId}",
      resource: "/appointments/{insuredId}",
    };

    const response = await handler(event as APIGatewayProxyEvent);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe("insuredId es requerido");
  });

  it("should return 404 for unknown route", async () => {
    const event: Partial<APIGatewayProxyEvent> = {
      httpMethod: "GET",
      path: "/no-existe",
      resource: "/no-existe",
    };

    const response = await handler(event as APIGatewayProxyEvent);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).message).toBe("Ruta no encontrada");
  });

  it("should return 200 on successful appointment creation", async () => {
    const event: Partial<APIGatewayProxyEvent> = {
      httpMethod: "POST",
      path: "/appointments",
      body: JSON.stringify({
        appointmentId: "123",
        insuredId: "32199",
        scheduleId: 999,
        description: "Prueba",
        countryISO: "PE",
        date: new Date().toISOString(),
      }),
    };

    const response = await handler(event as APIGatewayProxyEvent);

    expect(mockSave).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe("Cita creada correctamente");
  });

  it("should return 400 on invalid input (Zod error)", async () => {
    const event: Partial<APIGatewayProxyEvent> = {
      httpMethod: "POST",
      path: "/appointments",
      body: JSON.stringify({}), 
    };

    const response = await handler(event as APIGatewayProxyEvent);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe("Error de validación");
  });

  it("should update appointment status from SQS event", async () => {
    const sqsEvent: SQSEvent = {
      Records: [
        {
          messageId: "1",
          receiptHandle: "abc",
          body: JSON.stringify({
            "detail-type": appConfig.eventBridge.detailType,
            detail: {
              appointmentId: "abc-123",
              insuredId: "789",
            },
          }),
          attributes: {} as SQSRecordAttributes,
          messageAttributes: {},
          md5OfBody: "",
          eventSource: "aws:sqs",
          eventSourceARN: "arn:aws:sqs:123:test-queue",
          awsRegion: "us-east-1",
        },
      ],
    };

    const response = await handler(sqsEvent as any);

    expect(mockUpdateStatus).toHaveBeenCalledWith(
      "abc-123",
      "COMPLETED",
      "789"
    );
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe(
      "Estado actualizado desde SQS"
    );
  });

  it("should return 500 on unexpected error", async () => {
    mockGetByInsuredId.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const event: Partial<APIGatewayProxyEvent> = {
      httpMethod: "GET",
      path: "/appointments/{insuredId}",
      pathParameters: { insuredId: "123" },
    };

    const response = await handler(event as APIGatewayProxyEvent);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).message).toBe("Ruta no encontrada");
  });
});
