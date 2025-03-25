import { DateTime } from "luxon";
import Appointment from "../appointment";
import { describe, it, expect } from "@jest/globals";

/**
 * I'm not using a database for this project, so I'm using an in-memory array to store appointments.
 * This means I need to manually add appointments to the array to test the methods, so you'll see some
 * @ts-expect-error comments. This is not advisable for production code.
 */
describe("Appointment Class Methods", () => {
  describe("conflictsWithExistingAppointments()", () => {
    it("should return true if the appointment starts and ends at the same time as another appointment", () => {
      // Normally would use libraries to create dynamic data to prevent flaky tests.
      const existingAppointment = new Appointment({
        appointmentDateTime: "2025-01-01T00:00:00Z",
        timeZone: "America/New_York",
        customer: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
          email: "john.doe@example.com",
        },
        location: {
          line1: "123 Main St",
          zipCode: "12345",
          state: "NY",
          city: "New York",
        },
        vehicle: {
          vin: "1234567890",
        },
        appointmentDuration: 30,
      });

      // @ts-expect-error
      Appointment.save(existingAppointment);

      const isConflicting = Appointment.conflictsWithExistingAppointments({
        // Same start time as existing appointment
        startTime: DateTime.fromISO("2025-01-01T00:00:00Z"),
        // 30 minutes after the start time
        endTime: DateTime.fromISO("2025-01-01T00:30:00Z"),
      });

      expect(isConflicting).toBe(true);
    });

    it("should return true if the appointment starts before another appointment but ends at the same time as the existing appointment", () => {
      // Normally would use libraries to create dynamic data to prevent flaky tests.
      const existingAppointment = new Appointment({
        appointmentDateTime: "2025-01-01T01:00:00Z",
        timeZone: "America/New_York",
        customer: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
          email: "john.doe@example.com",
        },
        location: {
          line1: "123 Main St",
          zipCode: "12345",
          state: "NY",
          city: "New York",
        },
        vehicle: {
          vin: "1234567890",
        },
        appointmentDuration: 30,
      });

      // @ts-expect-error
      Appointment.save(existingAppointment);

      const isConflicting = Appointment.conflictsWithExistingAppointments({
        // 30 minutes before the existing appointment
        startTime: DateTime.fromISO("2025-01-01T00:30:00Z"),
        // Ends the same time as the existing appointment
        endTime: DateTime.fromISO("2025-01-01T01:30:00Z"),
      });

      expect(isConflicting).toBe(true);
    });

    it("should return true if the appointment starts before another appointment but ends within the existing appointment", () => {
      // Normally would use libraries to create dynamic data to prevent flaky tests.
      const existingAppointment = new Appointment({
        appointmentDateTime: "2025-01-01T01:00:00Z",
        timeZone: "America/New_York",
        customer: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
          email: "john.doe@example.com",
        },
        location: {
          line1: "123 Main St",
          zipCode: "12345",
          state: "NY",
          city: "New York",
        },
        vehicle: {
          vin: "1234567890",
        },
        appointmentDuration: 30,
      });

      // @ts-expect-error
      Appointment.save(existingAppointment);

      const isConflicting = Appointment.conflictsWithExistingAppointments({
        // 30 minutes before the existing appointment
        startTime: DateTime.fromISO("2025-01-01T00:30:00Z"),
        // Ends 15 minutes before the existing appointment
        endTime: DateTime.fromISO("2025-01-01T01:15:00Z"),
      });

      expect(isConflicting).toBe(true);
    });

    it("should return true if the appointment starts within an existing appointment and ends after it", () => {
      // Normally would use libraries to create dynamic data to prevent flaky tests.
      const existingAppointment = new Appointment({
        appointmentDateTime: "2025-01-01T01:00:00Z",
        timeZone: "America/New_York",
        customer: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
          email: "john.doe@example.com",
        },
        location: {
          line1: "123 Main St",
          zipCode: "12345",
          state: "NY",
          city: "New York",
        },
        vehicle: {
          vin: "1234567890",
        },
        appointmentDuration: 30,
      });

      // @ts-expect-error
      Appointment.save(existingAppointment);

      const isConflicting = Appointment.conflictsWithExistingAppointments({
        // 15 minutes after the existing appointment's start time
        startTime: DateTime.fromISO("2025-01-01T01:15:00Z"),
        // Ends 15 minutes after the existing appointment ends
        endTime: DateTime.fromISO("2025-01-01T01:45:00Z"),
      });

      expect(isConflicting).toBe(true);
    });

    it("should return true if the appointment starts at the same time an existing appointment ends", () => {
      // Normally would use libraries to create dynamic data to prevent flaky tests.
      const existingAppointment = new Appointment({
        appointmentDateTime: "2025-01-01T01:00:00Z",
        timeZone: "America/New_York",
        customer: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
          email: "john.doe@example.com",
        },
        location: {
          line1: "123 Main St",
          zipCode: "12345",
          state: "NY",
          city: "New York",
        },
        vehicle: {
          vin: "1234567890",
        },
        appointmentDuration: 30,
      });

      // @ts-expect-error
      Appointment.save(existingAppointment);

      const isConflicting = Appointment.conflictsWithExistingAppointments({
        // Same time as existing appointment ends
        startTime: DateTime.fromISO("2025-01-01T01:30:00Z"),
        // 30 minutes after this appointment starts
        endTime: DateTime.fromISO("2025-01-01T02:00:00Z"),
      });

      expect(isConflicting).toBe(true);
    });

    it("should return true if the appointment ends at the same time an existing appointment starts", () => {
      // Normally would use libraries to create dynamic data to prevent flaky tests.
      const existingAppointment = new Appointment({
        appointmentDateTime: "2025-01-01T01:00:00Z",
        timeZone: "America/New_York",
        customer: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
          email: "john.doe@example.com",
        },
        location: {
          line1: "123 Main St",
          zipCode: "12345",
          state: "NY",
          city: "New York",
        },
        vehicle: {
          vin: "1234567890",
        },
        appointmentDuration: 30,
      });

      // @ts-expect-error
      Appointment.save(existingAppointment);

      const isConflicting = Appointment.conflictsWithExistingAppointments({
        // 30 minutes before the existing appointment starts
        startTime: DateTime.fromISO("2025-01-01T00:30:00Z"),
        // Same time as the existing appointment starts
        endTime: DateTime.fromISO("2025-01-01T01:00:00Z"),
      });

      expect(isConflicting).toBe(true);
    });

    it("should return false if the appointment does not conflict with any existing appointments", () => {
      // Normally would use libraries to create dynamic data to prevent flaky tests.
      const existingAppointment = new Appointment({
        appointmentDateTime: "2025-01-01T01:00:00Z",
        timeZone: "America/New_York",
        customer: {
          firstName: "John",
          lastName: "Doe",
          phone: "1234567890",
          email: "john.doe@example.com",
        },
        location: {
          line1: "123 Main St",
          zipCode: "12345",
          state: "NY",
          city: "New York",
        },
        vehicle: {
          vin: "1234567890",
        },
        appointmentDuration: 30,
      });

      // @ts-expect-error
      Appointment.save(existingAppointment);

      const isConflicting = Appointment.conflictsWithExistingAppointments({
        // 15 minutes after the existing appointment's end time
        startTime: DateTime.fromISO("2025-01-01T01:45:00Z"),
        // 30 minutes after the new appointment's start time
        endTime: DateTime.fromISO("2025-01-01T02:15:00Z"),
      });

      expect(isConflicting).toBe(false);
    });
  });

  describe("isWithinWorkingHours()", () => {
    it("should return true if the appointment is within working hours for Eastern time zone", () => {
      const isWithinWorkingHours = Appointment.isWithinWorkingHours({
        startTime: DateTime.fromISO("2025-01-01T14:00:00Z"), // 9:00 AM ET
        endTime: DateTime.fromISO("2025-01-01T15:00:00Z"), // 10:00 AM ET
        timeZone: "America/New_York",
      });

      expect(isWithinWorkingHours).toBe(true);
    });

    it("should return true if the appointment is within working hours for Central time zone", () => {
      const isWithinWorkingHours = Appointment.isWithinWorkingHours({
        startTime: DateTime.fromISO("2025-01-01T15:00:00Z"), // 9:00 AM CT
        endTime: DateTime.fromISO("2025-01-01T16:00:00Z"), // 10:00 AM CT
        timeZone: "America/Chicago",
      });

      expect(isWithinWorkingHours).toBe(true);
    });

    it("should return true if the appointment is within working hours for Mountain time zone", () => {
      const isWithinWorkingHours = Appointment.isWithinWorkingHours({
        startTime: DateTime.fromISO("2025-01-01T16:00:00Z"), // 9:00 AM MT
        endTime: DateTime.fromISO("2025-01-01T17:00:00Z"), // 10:00 AM MT
        timeZone: "America/Denver",
      });

      expect(isWithinWorkingHours).toBe(true);
    });

    it("should return true if the appointment is within working hours for Pacific time zone", () => {
      const isWithinWorkingHours = Appointment.isWithinWorkingHours({
        startTime: DateTime.fromISO("2025-01-01T17:00:00Z"), // 9:00 AM PT
        endTime: DateTime.fromISO("2025-01-01T18:00:00Z"), // 10:00 AM PT
        timeZone: "America/Los_Angeles",
      });

      expect(isWithinWorkingHours).toBe(true);
    });

    it("should return false if the appointment is outside working hours for Eastern time zone", () => {
      const isWithinWorkingHours = Appointment.isWithinWorkingHours({
        startTime: DateTime.fromISO("2025-01-01T13:00:00Z"), // 8:00 AM ET
        endTime: DateTime.fromISO("2025-01-01T14:00:00Z"), // 9:00 AM ET
        timeZone: "America/New_York",
      });

      expect(isWithinWorkingHours).toBe(false);
    });

    it("should return false if the appointment is outside working hours for Central time zone", () => {
      const isWithinWorkingHours = Appointment.isWithinWorkingHours({
        startTime: DateTime.fromISO("2025-01-01T14:00:00Z"), // 8:00 AM CT
        endTime: DateTime.fromISO("2025-01-01T15:00:00Z"), // 9:00 AM CT
        timeZone: "America/Chicago",
      });

      expect(isWithinWorkingHours).toBe(false);
    });

    it("should return false if the appointment is outside working hours for Mountain time zone", () => {
      const isWithinWorkingHours = Appointment.isWithinWorkingHours({
        startTime: DateTime.fromISO("2025-01-01T15:00:00Z"), // 8:00 AM MT
        endTime: DateTime.fromISO("2025-01-01T16:00:00Z"), // 9:00 AM MT
        timeZone: "America/Denver",
      });

      expect(isWithinWorkingHours).toBe(false);
    });

    it("should return false if the appointment is outside working hours for Pacific time zone", () => {
      const isWithinWorkingHours = Appointment.isWithinWorkingHours({
        startTime: DateTime.fromISO("2025-01-01T16:00:00Z"), // 8:00 AM PT
        endTime: DateTime.fromISO("2025-01-01T17:00:00Z"), // 9:00 AM PT
        timeZone: "America/Los_Angeles",
      });

      expect(isWithinWorkingHours).toBe(false);
    });
  });
});
