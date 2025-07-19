import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ApiResponse } from "../../shared/response";
import { ZodError } from "zod";
import { formatZodError } from "../../shared/zod/format-zod-errors";
import { CreateScheduleController } from "../controllers/schedule/create-schedule.controller";
import { CreateScheduleUseCase } from "../../application/use-cases/create-schedule.use-case";
import { DynamoService } from "../../infrastructure/dynamodb/dynamo.service";
import { DynamoScheduleRepository } from "../../infrastructure/repositories/schedule-dynamo.repository";
import { ListSchedulesController } from "../controllers/schedule/get-schedule.controller";
import { ListAvailableSchedulesUseCase } from "../../application/use-cases/list-available-schedule.use-case";
const dynamoService = new DynamoService();
const scheduleRepository = new DynamoScheduleRepository(dynamoService);

const createScheduleUseCase = new CreateScheduleUseCase(scheduleRepository);
const listSchedulesUseCase = new ListAvailableSchedulesUseCase(
  scheduleRepository
);

const createScheduleController = new CreateScheduleController(
  createScheduleUseCase
);
const listScheduleController = new ListSchedulesController(
  listSchedulesUseCase
);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const method = event.httpMethod;
  const path = event.path;

  try {
    if (method === "POST" && path === "/schedule") {
      const parsedBody = JSON.parse(event.body || "{}");
      const response = await createScheduleController.create(parsedBody);

      return ApiResponse.ok(response, "Horario asignado con éxito");
    }
    if (method === "GET" && path === "/schedule") {
      const response = await listScheduleController.list();
      return ApiResponse.ok(response, "Horarios disponibles");
    }

    return ApiResponse.notFound("Ruta no encontrada");
  } catch (error) {
    console.log("error 22", error);
    if (error instanceof ZodError) {
      const formattedErrors = formatZodError(error);
      return ApiResponse.badRequest("Error de validación", formattedErrors);
    }

    return ApiResponse.internalError("Error inesperado");
  }
};
