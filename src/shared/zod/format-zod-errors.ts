import { ZodError } from "zod";

export function formatZodError(error: ZodError) {
  return error.issues.map((e) => ({
    path: e.path.join("."),
    message: e.message,
    code: e.code,
  }));
}
