class Appointment {
  constructor() {}

  static async schedule({
    appointmentDateTime,
    customer,
    location,
    vehicle,
    appointmentDuration,
  }: {
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
  }) {
    const canSchedule = await this.canSchedule({
      appointmentDateTime,
      appointmentDuration,
    });
    if (!canSchedule) {
      throw new Error("Cannot schedule appointment");
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
    appointmentDateTime: string;
    appointmentDuration: number;
  }): Promise<boolean> {}

  static async save({
    appointmentDateTime,
    customer,
    location,
    vehicle,
    appointmentDuration,
  }: {
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
  }): Promise<void> {}
}

export default Appointment;
