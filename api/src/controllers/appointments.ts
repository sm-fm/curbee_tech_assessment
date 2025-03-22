import { Router, Request, Response } from "express";
import Appointment from "../models/appointment";

const router = Router();

interface Body_POST_Appointment {
  appointmentDateTime: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  location: {
    line1: string;
    line2: string;
    zipCode: string;
    state: string;
    city: string;
  };
  vehicle: {
    vin: string;
  };
  appointmentDuration: number;
}

router.post(
  "/",
  async (req: Request<{}, {}, Body_POST_Appointment>, res: Response) => {
    const {
      appointmentDateTime,
      customer,
      location,
      vehicle,
      appointmentDuration,
    } = req.body;

    const appointment = await Appointment.schedule({
      appointmentDateTime,
      customer,
      location,
      vehicle,
      appointmentDuration,
    });

    res.sendStatus(201);
  }
);

export default router;
