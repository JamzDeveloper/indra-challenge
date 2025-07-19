import {
  Appointment,
  AppointmentStatus,
} from "../../domain/entities/appointment.entity";
import { NotificationServicePort } from "../../domain/ports/notification-service.port";
import { AppointmentRepositoryPort } from "../../domain/repositories/appointment-repository.port";
import { CreateAppointmentInput } from "../dtos/create-appointment.input";
import { randomUUID } from "crypto";

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly notifier: NotificationServicePort
  ) {}

  async execute(
    input: CreateAppointmentInput,
    options?: { skipNotification?: boolean }
  ) {
    const appointment = new Appointment({
      insuredId: input.insuredId,
      appointmentId: randomUUID(),
      scheduleId: input.scheduleId,
      description: input.description ? input.description : undefined,
      countryISO: input.countryISO,
      status: input.status ? (input.status as AppointmentStatus) : null,
      email: input.email ?? null,
    });

    await this.appointmentRepository.save(appointment);

    if (!options?.skipNotification) {
      await this.notifier.notify(appointment);
    }

    return appointment;
  }
}
