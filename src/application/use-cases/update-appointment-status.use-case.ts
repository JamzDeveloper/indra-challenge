import { AppointmentRepositoryPort } from "../../domain/repositories/appointment-repository.port";

export class UpdateAppointmentStatusUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort
  ) {}

  async execute(
    appointmentId: string,
    newStatus: string,
    insuredId?: string,
  ): Promise<void> {
    await this.appointmentRepository.updateStatus(
      appointmentId,
      newStatus,
      insuredId,
    );
  }
}
