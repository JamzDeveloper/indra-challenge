
import { Appointment, AppointmentProps } from "../../../src/domain/entities/appointment.entity";


describe("Appointment Entity", () => {
  const baseProps: AppointmentProps = {
    insuredId: "insured-123",
    appointmentId: "appointment-abc",
    scheduleId: 456,
    description: "Test appointment",
    countryISO:"PE"
  };

  it("should create an appointment with default values", () => {
    const appointment = new Appointment(baseProps);

    expect(appointment.insuredId).toBe(baseProps.insuredId);
    expect(appointment.appointmentId).toBe(baseProps.appointmentId);
    expect(appointment.scheduleId).toBe(baseProps.scheduleId);
    expect(appointment.getStatus()).toBe("PENDING");
    expect(appointment.createdAt).toBeInstanceOf(Date);
    expect(appointment.updatedAt).toBeInstanceOf(Date);
  });

  it("should return true if appointment is completed", () => {
    const appointment = new Appointment(baseProps);
    expect(appointment.isCompleted()).toBe(false);
    appointment.completeAppointment();
    expect(appointment.isCompleted()).toBe(true);
    expect(appointment.getStatus()).toBe("COMPLETED");
  });

  it("should generate correct PK, SK and GSI keys", () => {
    const appointment = new Appointment(baseProps);
    expect(appointment.getPK()).toBe("INSURED#insured-123");
    expect(appointment.getSK()).toBe("APPOINTMENT#appointment-abc");
    expect(appointment.getGSI1PK()).toBe("SCHEDULE#456");
    expect(appointment.getGSI1SK()).toBe("APPOINTMENT#appointment-abc");
  });

  it("should map to and from item correctly", () => {
    const appointment = new Appointment(baseProps);
    const item = appointment.toItem();
    const reconstructed = Appointment.fromItem(item);
    expect(reconstructed).toEqual(expect.any(Appointment));
    expect(reconstructed.insuredId).toBe(appointment.insuredId);
    expect(reconstructed.appointmentId).toBe(appointment.appointmentId);
    expect(reconstructed.scheduleId).toBe(appointment.scheduleId);
    expect(reconstructed.getStatus()).toBe(appointment.getStatus());
  });
});
