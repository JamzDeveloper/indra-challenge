import { ListAvailableSchedulesUseCase } from "../../../src/application/use-cases/list-available-schedule.use-case";
import { ScheduleRepositoryPort } from "../../../src/domain/repositories/schedure-repository.port";
import { Schedule } from "../../../src/domain/entities/schedule.entity";

describe("ListAvailableSchedulesUseCase", () => {
  let useCase: ListAvailableSchedulesUseCase;
  let scheduleRepository: jest.Mocked<ScheduleRepositoryPort>;

  beforeEach(() => {
    scheduleRepository = {
      listAvailable: jest.fn(),
      save:jest.fn()
    };
    useCase = new ListAvailableSchedulesUseCase(scheduleRepository);
  });

  it("should return the list of available schedules", async () => {
    const mockSchedules: Schedule[] = [
      new Schedule({
        scheduleId: 1,
        medicId: 23,
        specialtyId: 43,
        centerId: 43,
        date: new Date("2025-08-02T15:00:00Z"),
      }),
      new Schedule({
        scheduleId: 2,
        medicId: 54,
        specialtyId: 46,
        centerId: 22,
        date: new Date("2025-08-02T15:00:00Z"),
      }),
    ];

    scheduleRepository.listAvailable.mockResolvedValue(mockSchedules);

    const result = await useCase.execute();

    expect(result).toEqual(mockSchedules);
    expect(scheduleRepository.listAvailable).toHaveBeenCalledTimes(1);
  });

  it("should return an empty list if no schedules are available", async () => {
    scheduleRepository.listAvailable.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(scheduleRepository.listAvailable).toHaveBeenCalledTimes(1);
  });
});
