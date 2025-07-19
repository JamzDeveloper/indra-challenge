import { CreateAppointmentUseCase } from "../../../src/application/use-cases/create-appointment.use-case";
import { AppointmentRepositoryPort } from "../../../src/domain/repositories/appointment-repository.port";
import { CreateAppointmentInput } from "../../../src/application/dtos/create-appointment.input";
import { Appointment } from "../../../src/domain/entities/appointment.entity";
import { SnsNotificationService } from "../../../src/infrastructure/sns/sns-notification.service";
import { NotificationServicePort } from "../../../src/domain/ports/notification-service.port";
import { AppointmentStatus } from "../../../src/domain/entities/appointment.entity";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "mocked-uuid"),
}));

describe("CreateAppointmentUseCase", () => {
  let useCase: CreateAppointmentUseCase;
  let appointmentRepository: jest.Mocked<AppointmentRepositoryPort>;
  let notifier: jest.Mocked<NotificationServicePort>;

  beforeEach(() => {
    appointmentRepository = {
      save: jest.fn(),
      getByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };

    notifier = {
      notify: jest.fn(),
    };

    useCase = new CreateAppointmentUseCase(appointmentRepository, notifier);
  });

  it("should create an appointment and save it, then notify", async () => {
    const input: CreateAppointmentInput = {
      insuredId: "user-123",
      scheduleId: 100,
      description: "Consulta general",
      countryISO: "PE",
      email: "user@example.com",
      status: 'PENDING',
    };

    const result = await useCase.execute(input);

    expect(result).toBeInstanceOf(Appointment);
    expect(result).toMatchObject({
      insuredId: input.insuredId,
      scheduleId: input.scheduleId,
      description: input.description,
      countryISO: input.countryISO,
      email: input.email,
      appointmentId: "mocked-uuid",
      status: 'PENDING',
    });

    expect(appointmentRepository.save).toHaveBeenCalledWith(result);
    expect(notifier.notify).toHaveBeenCalledWith(result);
  });

  it("should create an appointment and skip notification if specified", async () => {
    const input: CreateAppointmentInput = {
      insuredId: "user-456",
      scheduleId: 200,
      description: "Odontología",
      countryISO: "PE",
    };

    const result = await useCase.execute(input, { skipNotification: true });

    expect(appointmentRepository.save).toHaveBeenCalledWith(result);
    expect(notifier.notify).not.toHaveBeenCalled();
  });
});
