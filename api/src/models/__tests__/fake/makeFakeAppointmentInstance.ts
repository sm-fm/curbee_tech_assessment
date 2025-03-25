import Appointment from "../../appointment";

/**
 * @param appointmentData - Partial appointment data to override the defaults.
 * @returns A hardcoded Appointment instance.
 *
 * TODO: Refactor to use libraries like faker.js to create dynamic data to prevent flaky tests.
 */
export const makeFakeAppointmentInstance = (
  appointmentData: Partial<Appointment> = {}
): Appointment => {
  return new Appointment({
    appointmentDateTime:
      appointmentData.appointmentDateTime || "2025-01-01T01:00:00Z",
    timeZone: appointmentData.timeZone || "America/New_York",
    customer: appointmentData.customer || {
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      email: "john.doe@example.com",
    },
    location: appointmentData.location || {
      line1: "123 Main St",
      zipCode: "12345",
      state: "NY",
      city: "New York",
    },
    vehicle: appointmentData.vehicle || {
      vin: "1234567890",
    },
    appointmentDuration: appointmentData.appointmentDuration || 30,
  });
};
