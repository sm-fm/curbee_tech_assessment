import { Router, Request, Response } from "express";
import { z } from "zod";
import Appointment from "../models/appointment";
import { appointmentSchema } from "../schemas/appointments";
import { Appointment as Body_POST_Appointment } from "../types/appointment";

const router = Router();

router.post(
  "/",
  async (req: Request<{}, {}, Body_POST_Appointment>, res: Response) => {
    try {
      // Validate the request body matches the expected schema
      const validatedAppointmentData = appointmentSchema.parse(req.body);

      const appointment = Appointment.schedule(validatedAppointmentData);

      res.status(201).json({ success: true, id: appointment.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle zod validation errors
        res.status(400).json({
          success: false,
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      } else {
        // Handle other errors (like from the Appointment.schedule method)
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  const appointments = Appointment.getAll();
  res.json({ success: true, appointments });
});

export default router;
