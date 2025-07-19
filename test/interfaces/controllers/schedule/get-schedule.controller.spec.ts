import { ListSchedulesController } from "../../../../src/interfaces/controllers/schedule/get-schedule.controller";
import { ListAvailableSchedulesUseCase } from "../../../../src/application/use-cases/list-available-schedule.use-case";

describe("ListSchedulesController", () => {
  it("should return list of schedules from the use case", async () => {
    const mockSchedules = [
      {
        scheduleId: 434,
        medicId: 434,
        date: "2024-09-30T12:30:00.000Z",
        centerId: 4,
        specialtyId: 3,
      },
      {
        scheduleId: 100,
        medicId: 542,
        date: "2024-09-30T12:30:00.000Z",
        centerId: 4,
        specialtyId: 3,
      },
    ];

    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockSchedules),
    } as unknown as ListAvailableSchedulesUseCase;

    const controller = new ListSchedulesController(mockUseCase);

    const result = await controller.list();

    expect(result).toEqual(mockSchedules);
    expect(mockUseCase.execute).toHaveBeenCalled();
  });
});
