import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepositoryPort } from "../../domain/repositories/appointment-repository.port";
import { poolCL } from "./mysql-cl.connection";

export class MySQLAppointmentCLRepository implements AppointmentRepositoryPort {
  async save(appointment: Appointment): Promise<void> {
    await poolCL.query(
      `INSERT INTO appointments (
        id, 
        schedule_id, 
        country_iso, 
        insured_id, 
        created_at, 
        updated_at, 
        description, 
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appointment.appointmentId,
        appointment.scheduleId,
        appointment.countryISO,
        appointment.insuredId,
        appointment.createdAt,
        appointment.updatedAt,
        appointment.description ?? null,
        appointment.getStatus() ?? null,
      ]
    );
  }

  async getByInsuredId(insuredId: string): Promise<Appointment[]> {
    const [rows] = await poolCL.query(
      `SELECT 
         id, 
         schedule_id, 
         country_iso, 
         insured_id, 
         created_at, 
         updated_at, 
         description, 
         status 
       FROM appointments 
       WHERE insured_id = ?`,
      [insuredId]
    );

    return (rows as any[]).map(
      (row) =>
        new Appointment({
          appointmentId: row.id,
          scheduleId: row.schedule_id,
          countryISO: row.country_iso,
          insuredId: row.insured_id,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          description: row.description,
          status: row.status,
        })
    );
  }

  async updateStatus(
    appointmentId: string,
    status: string
  ): Promise<void> {
    await poolCL.query(
      `UPDATE appointments SET status = ?, updated_at = ? WHERE id = ?`,
      [status, new Date(), appointmentId]
    );
  }
}
