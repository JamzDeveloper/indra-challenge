import { Schedule } from "../../domain/entities/schedule.entity";
import { ScheduleRepositoryPort } from "../../domain/repositories/schedure-repository.port";
import { CreateScheduleInput } from "../dtos/create-schedule.input";

export class CreateScheduleUseCase {
  constructor(private readonly scheduleRepo: ScheduleRepositoryPort) {}

  async execute(input: CreateScheduleInput) {
    const schedule = new Schedule({
      scheduleId: input.scheduleId,
      centerId: input.centerId,
      specialtyId: input.specialtyId,
      medicId: input.medicId,
      date: input.date,
    });

    await this.scheduleRepo.save(schedule);
    return schedule;
  }
}
