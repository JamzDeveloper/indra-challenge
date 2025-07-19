import { GetAppointmentUseCase } from "../../../application/use-cases/get-appointment.use-case";


export class GetAppointmentController {
  constructor(
    private readonly getAppointmentUseCase: GetAppointmentUseCase
  ) {}

  async execute(params: { insuredId: string }) {
    const { insuredId } = params;
    const result = await this.getAppointmentUseCase.execute(insuredId);
    return result;
  }
}
