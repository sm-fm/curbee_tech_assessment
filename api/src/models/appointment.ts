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
  private static appointments: Appointment[] = [];

  // Properties
  readonly id: string;
  /**
   * ISO 8601 with timezone offset. Could be stored as a number (UNIX timestamp) to decrease size, but then would need to store
   * timezone, which would increase complexity beyond the scope of this project.
   */
  public appointmentDateTime: string;
  /**
   * IANA or POSIX formatted time zone as supported by Luxon.
   */
  public timeZone: string;
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
    id?: string;
    appointmentDateTime: string;
    timeZone: string;
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
    this.id = data.id || randomUUID();
    this.appointmentDateTime = data.appointmentDateTime;
    this.timeZone = data.timeZone;
    this.customer = data.customer;
    this.location = data.location;
    this.vehicle = data.vehicle;
    this.appointmentDuration = data.appointmentDuration;
  }

  static schedule({
    appointmentDateTime,
    timeZone,
    customer,
    location,
    vehicle,
    appointmentDuration,
  }: z.infer<typeof appointmentSchema>): Appointment {
    const canSchedule = this.canSchedule({
      appointmentDateTime,
      timeZone,
      appointmentDuration,
    });
    if (!canSchedule) {
      throw new Error("This appointment time is already booked");
    }

    const appointment = this.save({
      appointmentDateTime,
      timeZone,
      customer,
      location,
      vehicle,
      appointmentDuration,
    });

    return appointment;
  }

  static canSchedule({
    appointmentDateTime,
    timeZone,
    appointmentDuration,
  }: {
    appointmentDateTime: Appointment["appointmentDateTime"];
    timeZone: Appointment["timeZone"];
    appointmentDuration: Appointment["appointmentDuration"];
  }): boolean {
    const startTime = DateTime.fromISO(appointmentDateTime);
    const endTime = startTime.plus({ minutes: appointmentDuration });
    const isWithinWorkingHours = this.isWithinWorkingHours({
      startTime,
      endTime,
      timeZone,
    });
    const conflictsWithOtherAppointments =
      this.conflictsWithExistingAppointments({
        startTime,
        endTime,
      });

    if (!isWithinWorkingHours || conflictsWithOtherAppointments) {
      return false;
    }

    return true;
  }

  /**
   * Ensures the appointment is within the business hours of 9am-5pm for the given start/endTime and timeZone.
   * Handles the case where an appointment could start at 4:15pm and end at 5:15pm (would return false since it ends after 5pm).
   */
  static isWithinWorkingHours({
    startTime,
    endTime,
    timeZone,
  }: {
    startTime: DateTime;
    endTime: DateTime;
    timeZone: Appointment["timeZone"];
  }): boolean {
    const localStartTime = startTime.setZone(timeZone);
    const localEndTime = endTime.setZone(timeZone);
    const businessStart = localStartTime.set({
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const businessEnd = localStartTime.set({
      hour: 17,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    return localStartTime >= businessStart && localEndTime <= businessEnd;
  }

  /**
   * Handles the following cases:
   *   - The appointment starts and ends within another appointment
   *   - The appointment starts before another appointment and ends within it
   *   - The appointment starts within another appointment and ends after it
   *   - The appointment starts before and ends after another appointment
   */
  static conflictsWithExistingAppointments({
    startTime,
    endTime,
  }: {
    startTime: DateTime;
    endTime: DateTime;
  }): boolean {
    const conflicts = this.appointments.filter((appointment) => {
      const appointmentStartTime = DateTime.fromISO(
        appointment.appointmentDateTime
      );
      const appointmentEndTime = appointmentStartTime.plus({
        minutes: appointment.appointmentDuration,
      });

      return startTime < appointmentEndTime && endTime > appointmentStartTime;
    });

    return conflicts.length > 0;
  }

  /**
   * This method assumes that the appointment is within business hours for the local time given and does not interfere
   * with existing appointments. Therefore, validate those assumptions before calling this method.
   */
  private static save({
    appointmentDateTime,
    timeZone,
    customer,
    location,
    vehicle,
    appointmentDuration,
  }: z.infer<typeof appointmentSchema>): Appointment {
    const appointment = new Appointment({
      appointmentDateTime,
      timeZone,
      customer,
      location,
      vehicle,
      appointmentDuration,
    });

    this.appointments.push(appointment);

    return appointment;
  }

  static getAll(): Appointment[] {
    return this.appointments;
  }
}

export default Appointment;
