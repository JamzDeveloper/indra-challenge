export interface CreateAppointmentInput {
  insuredId: string;
  scheduleId: number;
  countryISO: "PE" | "CL";
  description?: string | null;
  status?: string | null;
  email?: string | null;
}
