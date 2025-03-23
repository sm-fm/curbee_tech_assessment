import { z } from "zod";
import { appointmentSchema } from "../schemas/appointments";

export type Appointment = z.infer<typeof appointmentSchema>;
