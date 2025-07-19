import { SNSEvent } from "aws-lambda";
import { CreateAppointmentUseCase } from "../../application/use-cases/create-appointment.use-case";
import { SnsNotificationService } from "../sns/sns-notification.service";
import { Appointment } from "../../domain/entities/appointment.entity";
import { MySQLAppointmentCLRepository } from "../mysql/mysql-appointment-cl.repository";
import { EventBridgeService } from "../eventbridge/eventbridge.service";
import { appConfig } from "../config/app.config";

export const handler = async (event: SNSEvent): Promise<void> => {
  try {
    const record = event.Records[0];
    const message = JSON.parse(record.Sns.Message);
    const repository = new MySQLAppointmentCLRepository();
    const notifier = new SnsNotificationService();

    const useCase = new CreateAppointmentUseCase(repository, notifier);

    const appointment = new Appointment(message);

    await useCase.execute(appointment.toInput(), { skipNotification: true });

    const eb = new EventBridgeService();

    await eb.emitDetail(
      {
        appointmentId: appointment.appointmentId,
        insuredId: appointment.insuredId,
      },
      appConfig.eventBridge.detailType,
      "appointment.handler",
      appConfig.eventBridge.bus
    );
  } catch (error) {
    console.error("[PE] Error saving appointment:", error);
    throw error;
  }
};
