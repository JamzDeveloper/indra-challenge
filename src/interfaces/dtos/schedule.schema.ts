import { z } from "zod";

export const createScheduleSchema = z.object({
  scheduleId: z.number().int().positive({
    message: "El ID de horario debe ser un número entero positivo",
  }),
  centerId: z.number().int().positive({
    message: "El ID del centro debe ser un número entero positivo",
  }),
  specialtyId: z.number().int().positive({
    message: "El ID de la especialidad debe ser un número entero positivo",
  }),
  medicId: z.number().int().positive({
    message: "El ID del médico debe ser un número entero positivo",
  }),

  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Debe ser una fecha válida en formato ISO 8601",
    })
    .transform((val) => new Date(val)),
});

export type CreateScheduleDto = z.infer<typeof createScheduleSchema>;
