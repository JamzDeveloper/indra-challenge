import { Appointment } from "../entities/appointment.entity";

export interface AppointmentRepositoryPort {
  save(appointment: Appointment): Promise<void>;
  getByInsuredId(insuredId: string): Promise<Appointment[]>;
  updateStatus(
    appointmentId: string,
    status: string,
    insuredId?: string
  ): Promise<void>;
  
}
