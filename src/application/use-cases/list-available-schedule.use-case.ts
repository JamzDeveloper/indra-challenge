import { Schedule } from "../../domain/entities/schedule.entity";
import { ScheduleRepositoryPort } from "../../domain/repositories/schedure-repository.port";

export class ListAvailableSchedulesUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepositoryPort) {}

  async execute(): Promise<Schedule[]> {
    return this.scheduleRepository.listAvailable();
  }
}
