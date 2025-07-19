import { UpdateAppointmentController } from "../../../../src/interfaces/controllers/appointment/update-appointment.controller";
import { UpdateAppointmentStatusUseCase } from "../../../../src/application/use-cases/update-appointment-status.use-case";

describe("UpdateAppointmentController", () => {
  it("should call the use case with correct parameters", async () => {
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as unknown as UpdateAppointmentStatusUseCase;

    const controller = new UpdateAppointmentController(mockUseCase);

    const params = {
      appointmentId: "123",
      status: "COMPLETED",
      insuredId: "456",
    };

    await controller.execute(params);

    expect(mockUseCase.execute).toHaveBeenCalledWith(
      "123",
      "COMPLETED",
      "456"
    );
  });
});
