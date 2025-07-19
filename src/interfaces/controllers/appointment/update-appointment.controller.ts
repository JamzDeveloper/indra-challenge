import { UpdateAppointmentStatusUseCase } from "../../../application/use-cases/update-appointment-status.use-case";

export class UpdateAppointmentController {
  constructor(
    private readonly updateAppointmentUseCase: UpdateAppointmentStatusUseCase
  ) {}

  async execute(params: {
    appointmentId: string;
    status: string;
    insuredId?: string;
  }) {
    const { appointmentId, status, insuredId } = params;
    return await this.updateAppointmentUseCase.execute(
      appointmentId,
      status,
      insuredId
    );
  }
}
