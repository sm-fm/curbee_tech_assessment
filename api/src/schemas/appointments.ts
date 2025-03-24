import { DateTime } from "luxon";
import { z } from "zod";

export const appointmentSchema = z.object({
  appointmentDateTime: z.string().datetime(),
  timeZone: z.string().refine(
    (tz) => {
      try {
        return Boolean(DateTime.now().setZone(tz).isValid);
      } catch (error) {
        return false;
      }
    },
    {
      message:
        "Invalid time zone -- Must be a valid IANA or POSIX time zone (e.g. America/New_York or EST5EDT)",
    }
  ),
  customer: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(5, "Valid phone number is required"),
    email: z.string().email("Valid email is required"),
  }),
  location: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    zipCode: z.string().min(1, "Zip code is required"),
    state: z.string().length(2, "State should be the two letter abbreviation"),
    city: z.string().min(1, "City is required"),
  }),
  vehicle: z.object({
    vin: z.string().min(1, "VIN is required"),
  }),
  appointmentDuration: z.number().min(1, "Duration must be greater than 0"),
});
