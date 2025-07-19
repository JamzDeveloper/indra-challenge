
import { ListAvailableSchedulesUseCase } from "../../../application/use-cases/list-available-schedule.use-case";

export class ListSchedulesController {
  constructor(
    private readonly listSchedulesUseCase: ListAvailableSchedulesUseCase
  ) {}

  async list() {
    const result = await this.listSchedulesUseCase.execute();
    return result;
  }
}
