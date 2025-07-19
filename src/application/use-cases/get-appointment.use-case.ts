import { AppointmentRepositoryPort } from "../../domain/repositories/appointment-repository.port";
import { Appointment } from "../../domain/entities/appointment.entity";

export class GetAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort
  ) {}

  async execute(insuredId: string): Promise<Appointment[]> {
    return this.appointmentRepository.getByInsuredId(insuredId);
  }
}
