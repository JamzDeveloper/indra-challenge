import { CreateScheduleUseCase } from "../../../src/application/use-cases/create-schedule.use-case";
import { Schedule } from "../../../src/domain/entities/schedule.entity";
import { ScheduleRepositoryPort } from "../../../src/domain/repositories/schedure-repository.port";


describe("CreateScheduleUseCase", () => {
  let scheduleRepo: jest.Mocked<ScheduleRepositoryPort>;
  let useCase: CreateScheduleUseCase;

  beforeEach(() => {
    scheduleRepo = {
      save: jest.fn(),
      listAvailable:jest.fn()
    };

    useCase = new CreateScheduleUseCase(scheduleRepo);
  });

  it("should create and save a schedule", async () => {
    const input = {
      scheduleId: 100,
      centerId: 45,
      specialtyId:45,
      medicId: 34,
      date: new Date("2025-01-01T10:00:00Z"),
    };

    const result = await useCase.execute(input);

    expect(scheduleRepo.save).toHaveBeenCalledTimes(1);
    expect(scheduleRepo.save).toHaveBeenCalledWith(expect.any(Schedule));
    expect(result).toBeInstanceOf(Schedule);
    expect(result.scheduleId).toBe(input.scheduleId);
    expect(result.centerId).toBe(input.centerId);
  });
});
