import { CreateAppointmentUseCase } from "../../../../src/application/use-cases/create-appointment.use-case";
import { Appointment } from "../../../../src/domain/entities/appointment.entity";
import { ZodError } from "zod";
import { AppointmentController } from "../../../../src/interfaces/controllers/appointment/create-appointment.controller";
import { randomUUID } from "crypto";

describe("AppointmentController", () => {
  let mockUseCase: jest.Mocked<CreateAppointmentUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateAppointmentUseCase>;
  });

  it("should call createAppointmentUseCase with validated dto and return result", async () => {
    const controller = new AppointmentController(mockUseCase);
    const validBody = {
      insuredId: "00878",
      scheduleId: 78475,
      countryISO: "PE",
      appointmentId: randomUUID(),
      description: undefined,
    };

    const expectedAppointment = new Appointment({
      insuredId: validBody.insuredId,
      appointmentId: validBody.appointmentId,
      description: validBody.description,
      scheduleId: validBody.scheduleId,
      countryISO: validBody.countryISO as "PE" | "CL",
    });

    mockUseCase.execute.mockResolvedValue(expectedAppointment);

    const result = await controller.create(validBody);
    expect(mockUseCase.execute).toHaveBeenCalledWith({
      insuredId: "00878",
      scheduleId: 78475,
      countryISO: "PE",
    });

    expect(result).toEqual(expectedAppointment);
  });

  it("should throw validation error when body is invalid", async () => {
    const controller = new AppointmentController(mockUseCase);

    const invalidBody = {
      appointmentId: "456",
      date: "not-a-date",
    };

    await expect(controller.create(invalidBody)).rejects.toThrow(ZodError);
    expect(mockUseCase.execute).not.toHaveBeenCalled();
  });
});
