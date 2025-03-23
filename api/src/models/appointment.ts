import { randomUUID } from "crypto";
import { z } from "zod";
import { DateTime } from "luxon";
import { appointmentSchema } from "../schemas/appointments";

/**
 * I typically work with ORMs like Prisma or Objection/Knex. Objection/Knex structures models as classes like this, whereas
 * Prisma uses a generated client. I could still use a pattern like this, but my Appointment class would be more of a service
 * class than a model class.
 *
 * For the sake of this project, I'm just making a class for the model.
 */
class Appointment {
  // In memory storage of appointments with the appointmentDateTime as the key for faster lookups
  private static appointments: {
    [key: Appointment["appointmentDateTime"]]: Appointment;
  } = {};

  // Properties
  readonly id: string;
  /**
   * ISO 8601 with timezone offset. Could be stored as a number (UNIX timestamp) to decrease size, but then would need to store
   * timezone, which would increase complexity beyond the scope of this project.
   */
  public appointmentDateTime: string;
  public customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  public location: {
    line1: string;
    line2?: string;
    zipCode: string;
    state: string;
    city: string;
  };
  public vehicle: {
    vin: string;
  };
  public appointmentDuration: number;

  constructor(data: {
    id: string;
    appointmentDateTime: string;
    customer: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    location: {
      line1: string;
      line2?: string;
      zipCode: string;
      state: string;
      city: string;
    };
    vehicle: {
      vin: string;
    };
    appointmentDuration: number;
  }) {
    this.id = randomUUID();
    this.appointmentDateTime = data.appointmentDateTime;
    this.customer = data.customer;
    this.location = data.location;
    this.vehicle = data.vehicle;
    this.appointmentDuration = data.appointmentDuration;
  }

  static async schedule({
    appointmentDateTime,
    customer,
    location,
    vehicle,
    appointmentDuration,
  }: z.infer<typeof appointmentSchema>): Promise<Appointment> {
    const canSchedule = await this.canSchedule({
      appointmentDateTime,
      appointmentDuration,
    });
    if (!canSchedule) {
      throw new Error("This appointment time is already booked");
    }

    const appointment = await this.save({
      appointmentDateTime,
      customer,
      location,
      vehicle,
      appointmentDuration,
    });

    return appointment;
  }

  static async canSchedule({
    appointmentDateTime,
    appointmentDuration,
  }: {
    appointmentDateTime: Appointment["appointmentDateTime"];
    appointmentDuration: Appointment["appointmentDuration"];
  }): Promise<boolean> {}

  /**
   * Ensures the appointment is within the business hours of 9am-5pm for the given date and time zone.
   * Handles the case where an appointment could start at 4:15pm and end at 5:15pm (would return false since it ends after 5pm).
   */
  static isWithinWorkingHours({
    appointmentDateTime,
    appointmentDuration,
  }: {
    appointmentDateTime: Appointment["appointmentDateTime"];
    appointmentDuration: Appointment["appointmentDuration"];
  }): boolean {
    const startTime = DateTime.fromISO(appointmentDateTime);
    const endTime = startTime.plus({ minutes: appointmentDuration });

    const businessStart = startTime.set({
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const businessEnd = startTime.set({
      hour: 17,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    return startTime >= businessStart && endTime <= businessEnd;
  }

  static async save({
    appointmentDateTime,
    customer,
    location,
    vehicle,
    appointmentDuration,
  }: z.infer<typeof appointmentSchema>): Promise<Appointment> {}
}

export default Appointment;
