import { z } from "zod";

export const createAppointmentSchema = z.object({
  insuredId: z
    .string()
    .regex(
      /^\d{5}$/,
      "insuredId debe tener 5 dígitos (puede incluir ceros a la izquierda)"
    ),

  scheduleId: z
    .number()
    .int("scheduleId debe ser un número entero")
    .positive("scheduleId debe ser positivo"),

  countryISO: z.enum(["PE", "CL"], {
    message: 'countryISO debe ser "PE" o "CL"',
  }),
  email: z
    .email("El correo electrónico no tiene un formato válido.")
    .optional()
    .or(z.literal("")),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
