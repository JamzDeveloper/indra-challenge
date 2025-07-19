import { Schedule } from "../entities/schedule.entity";

export interface ScheduleRepositoryPort {
  save(schedule: Schedule): Promise<void>;
  listAvailable(): Promise<Schedule[]>;

}
