import { GetAppointmentUseCase } from "../../../../src/application/use-cases/get-appointment.use-case";
import { GetAppointmentController } from "../../../../src/interfaces/controllers/appointment/get-appointments.controller";

describe("GetAppointmentController", () => {
  it("should return the result from the use case", async () => {
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue([
        {
          appointmentId: "123",
          insuredId: "456",
          date: "2025-07-25T10:00:00Z",
          description: "Check-up",
        },
      ]),
    } as unknown as GetAppointmentUseCase;

    const controller = new GetAppointmentController(mockUseCase);

    const params = { insuredId: "456" };

    const result = await controller.execute(params);

    expect(mockUseCase.execute).toHaveBeenCalledWith("456");
    expect(result).toEqual([
      {
        appointmentId: "123",
        insuredId: "456",
        date: "2025-07-25T10:00:00Z",
        description: "Check-up",
      },
    ]);
  });
});
