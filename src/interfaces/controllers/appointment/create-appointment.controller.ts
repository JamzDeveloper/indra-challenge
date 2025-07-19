import { CreateAppointmentUseCase } from "../../../application/use-cases/create-appointment.use-case";
import { createAppointmentSchema } from "../../dtos/appointment.schema";

export class AppointmentController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase
  ) {}

  async create(body: any) {
    const dto = createAppointmentSchema.parse(body);
    console.log("AppointmentController 11", dto);

    const result = await this.createAppointmentUseCase.execute(dto);
    return result;
  }
}
