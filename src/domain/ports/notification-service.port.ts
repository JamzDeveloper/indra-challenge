
import { Appointment } from "../entities/appointment.entity";

export interface NotificationServicePort {
  notify(appointment: Appointment): Promise<void>;
}
