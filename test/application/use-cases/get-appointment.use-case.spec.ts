import { GetAppointmentUseCase } from "../../../src/application/use-cases/get-appointment.use-case";
import { Appointment } from "../../../src/domain/entities/appointment.entity";
import { AppointmentRepositoryPort } from "../../../src/domain/repositories/appointment-repository.port";

describe("GetAppointmentUseCase", () => {
  let appointmentRepository: jest.Mocked<AppointmentRepositoryPort>;
  let useCase: GetAppointmentUseCase;

  beforeEach(() => {
    appointmentRepository = {
      save: jest.fn(),
      getByInsuredId: jest.fn(),
      updateStatus:jest.fn()
    };

    useCase = new GetAppointmentUseCase(appointmentRepository);
  });

  it("should return a list of appointments by insuredId", async () => {
    const mockAppointments: Appointment[] = [
      new Appointment({
        appointmentId: "1",
        insuredId: "insured-1",
        scheduleId: 100,
        description: "Consulta médica",
        countryISO: "PE",
      }),
      new Appointment({
        appointmentId: "2",
        insuredId: "insured-1",
        scheduleId: 100,
        description: "Chequeo",
        countryISO: "PE",
      }),
    ];

    appointmentRepository.getByInsuredId.mockResolvedValue(mockAppointments);

    const result = await useCase.execute("insured-1");

    expect(appointmentRepository.getByInsuredId).toHaveBeenCalledWith(
      "insured-1"
    );
    expect(result).toEqual(mockAppointments);
  });
});
