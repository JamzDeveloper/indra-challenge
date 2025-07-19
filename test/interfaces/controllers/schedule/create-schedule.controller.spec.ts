import { CreateScheduleController } from "../../../../src/interfaces/controllers/schedule/create-schedule.controller";
import { CreateScheduleUseCase } from "../../../../src/application/use-cases/create-schedule.use-case";

describe("CreateScheduleController", () => {
  let controller: CreateScheduleController;
  let mockUseCase: jest.Mocked<CreateScheduleUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateScheduleUseCase>;

    controller = new CreateScheduleController(mockUseCase);
  });

  it("should validate the input, call use case with dto and return result", async () => {
    const validBody = {
      scheduleId: 1,
      centerId: 2,
      specialtyId: 3,
      medicId: 4,
      date: "2025-07-20T10:00:00Z",
    };

    const expectedDto = {
      ...validBody,
      date: new Date("2025-07-20T10:00:00Z"),
    };

    const expectedResult = {
      scheduleId: 1234,
      providerId: "prov-001",
      startDate: new Date("2025-07-20T10:00:00Z"),
      endDate: new Date("2025-07-20T12:00:00Z"),
      timezone: "America/Lima",
    };

    mockUseCase.execute.mockResolvedValue(expectedResult as any);

    const result = await controller.create(validBody);

    expect(mockUseCase.execute).toHaveBeenCalledWith(expectedDto);
    expect(result).toEqual(expectedResult);
  });

  it("should throw if validation fails", async () => {
    const invalidBody = {
      providerId: "prov-001",
      startDate: "not-a-date",
      endDate: "2025-07-20T12:00:00Z",
      timezone: "America/Lima",
    };

    await expect(controller.create(invalidBody)).rejects.toThrow();
    expect(mockUseCase.execute).not.toHaveBeenCalled();
  });
});
