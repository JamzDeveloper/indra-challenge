import { UpdateAppointmentStatusUseCase } from "../../../src/application/use-cases/update-appointment-status.use-case";
import { AppointmentRepositoryPort } from "../../../src/domain/repositories/appointment-repository.port";

describe("UpdateAppointmentStatusUseCase", () => {
  let useCase: UpdateAppointmentStatusUseCase;
  let appointmentRepository: jest.Mocked<AppointmentRepositoryPort>;

  beforeEach(() => {
    appointmentRepository = {
      updateStatus: jest.fn(),
    } as any;
    useCase = new UpdateAppointmentStatusUseCase(appointmentRepository);
  });

  it("should update appointment status with insuredId", async () => {
    await useCase.execute("123", "CONFIRMED", "999");

    expect(appointmentRepository.updateStatus).toHaveBeenCalledWith(
      "123",
      "CONFIRMED",
      "999"
    );
  });

  it("should update appointment status without insuredId", async () => {
    await useCase.execute("456", "CANCELLED");

    expect(appointmentRepository.updateStatus).toHaveBeenCalledWith(
      "456",
      "CANCELLED",
      undefined
    );
  });
});
