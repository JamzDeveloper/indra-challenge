import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  EventBridgeEvent,
  SQSEvent,
} from "aws-lambda";
import { ApiResponse } from "../../shared/response";
import { ZodError } from "zod";
import { formatZodError } from "../../shared/zod/format-zod-errors";

import { DynamoService } from "../../infrastructure/dynamodb/dynamo.service";
import { DynamoAppointmentRepository } from "../../infrastructure/repositories/appointment-dynamo.repository";
import { CreateAppointmentUseCase } from "../../application/use-cases/create-appointment.use-case";
import { AppointmentController } from "../controllers/appointment/create-appointment.controller";
import { GetAppointmentController } from "../controllers/appointment/get-appointments.controller";
import { GetAppointmentUseCase } from "../../application/use-cases/get-appointment.use-case";
import { SnsNotificationService } from "../../infrastructure/sns/sns-notification.service";
import { appConfig } from "../../infrastructure/config/app.config";
import { UpdateAppointmentStatusUseCase } from "../../application/use-cases/update-appointment-status.use-case";
import { UpdateAppointmentController } from "../controllers/appointment/update-appointment.controller";

const dynamoService = new DynamoService();
const appointmentRepository = new DynamoAppointmentRepository(dynamoService);
const notifier = new SnsNotificationService();
const createAppointmentUseCase = new CreateAppointmentUseCase(
  appointmentRepository,
  notifier
);
const appointmentController = new AppointmentController(
  createAppointmentUseCase
);

const getAppointmentUseCase = new GetAppointmentUseCase(appointmentRepository);
const getAppointmentController = new GetAppointmentController(
  getAppointmentUseCase
);

const updateAppointmentUseCase = new UpdateAppointmentStatusUseCase(
  appointmentRepository
);
const updateAppointmentController = new UpdateAppointmentController(
  updateAppointmentUseCase
);

function isSQSEvent(event: any): event is SQSEvent {
  return (
    Array.isArray(event.Records) && event.Records[0]?.eventSource === "aws:sqs"
  );
}
export const handler = async (
  event: APIGatewayProxyEvent | EventBridgeEvent<any, any>
): Promise<APIGatewayProxyResult> => {
  console.log("handler appointment handler", event);
  if (isSQSEvent(event)) {
    console.log(" 🛜handler appointment isSQSEvent", true);

    for (const record of event.Records) {
      const parsedBody = JSON.parse(record.body);
      console.log("parsedBody parsedBody", parsedBody);
      const { detail } = parsedBody;

      if (parsedBody["detail-type"] === appConfig.eventBridge.detailType) {
        const { appointmentId, insuredId } = detail;

        if (!appointmentId || !insuredId) continue;
        await updateAppointmentController.execute({
          appointmentId: appointmentId,
          insuredId,
          status: "COMPLETED",
        });
        console.log("✅ Evento desde SQS recibido:", appointmentId);
      }
    }

    return ApiResponse.ok(null, "Estado actualizado desde SQS");
  }
  const method = (event as APIGatewayProxyEvent).httpMethod;
  const path = (event as APIGatewayProxyEvent).path;
  const body = (event as APIGatewayProxyEvent).body;

  try {
    if (method === "POST" && path === "/appointments") {
      const parsedBody = JSON.parse(body || "{}");
      const response = await appointmentController.create(parsedBody);
      console.log("response 78", response);
      return ApiResponse.ok(response, "Cita creada correctamente");
    }

    if (method === "GET" && (event as APIGatewayProxyEvent ).resource=== "/appointments/{insuredId}") {
      const insuredId = (event as APIGatewayProxyEvent).pathParameters?.insuredId;

      if (!insuredId) {
        return ApiResponse.badRequest("insuredId es requerido");
      }

      const appointments = await getAppointmentController.execute({
        insuredId,
      });

      return ApiResponse.ok(appointments, "Citas obtenidas correctamente");
    }

    return ApiResponse.notFound("Ruta no encontrada");
  } catch (error) {
    console.log("error 88", error);
    if (error instanceof ZodError) {
      const formattedErrors = formatZodError(error);
      return ApiResponse.badRequest("Error de validación", formattedErrors);
    }

    return ApiResponse.internalError("Error inesperado");
  }
};
