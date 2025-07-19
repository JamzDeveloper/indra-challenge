import { handler } from "../../../src/interfaces/handlers/schedule-handler";
import { APIGatewayProxyEvent } from "aws-lambda";

jest.mock(
  "../../../src/infrastructure/repositories/schedule-dynamo.repository",
  () => {
    return {
      DynamoScheduleRepository: jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          scheduleId: "1",
          userId: "123",
          date: "2025-08-20T10:00:00.000Z",
          duration: 60,
        }),
      })),
    };
  }
);

jest.mock("../../../src/infrastructure/dynamodb/dynamo.service", () => {
  return {
    DynamoService: jest.fn().mockImplementation(() => ({})),
  };
});

describe("Schedule Handler", () => {
  it("should create a schedule successfully and return status 200", async () => {
    const event = {
      httpMethod: "POST",
      path: "/schedule",
      body: JSON.stringify({
        scheduleId: 1,
        centerId: 101,
        specialtyId: 5,
        medicId: 88,
        date: "2025-08-20T10:00:00.000Z",
      }),
    } as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.message).toBe("Horario asignado con éxito");
    expect(body.data).toHaveProperty("scheduleId");
  });

  it("should return 404 if called with an invalid route", async () => {
    const event = {
      httpMethod: "POST",
      path: "/another-route",
      body: JSON.stringify({}),
    } as APIGatewayProxyEvent;

    const response = await handler(event);
    expect(response.statusCode).toBe(404);
  });

  it("should return 400 if validation fails (Zod)", async () => {
    const event = {
      httpMethod: "POST",
      path: "/schedule",
      body: JSON.stringify({}),
    } as APIGatewayProxyEvent;

    const response = await handler(event);
    expect(response.statusCode).toBe(400);
  });
});
