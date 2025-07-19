import { CreateScheduleUseCase } from "../../../application/use-cases/create-schedule.use-case";
import {
  createScheduleSchema,
} from "../../dtos/schedule.schema";

export class CreateScheduleController {
  constructor(private readonly createScheduleUseCase: CreateScheduleUseCase) {}

  async create(body: any) {
    const dto = createScheduleSchema.parse(body);
    console.log("CreateScheduleController 11", dto);

    const result = await this.createScheduleUseCase.execute(dto);

    return result;
  }
}
