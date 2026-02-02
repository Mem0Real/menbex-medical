import { APPOINTMENT_DURATION } from "./appointmentRules";
import { ConsultationType } from "@/prisma/generated/client";


type AppointmentLike = {
  scheduledAt: Date;
  consultation: ConsultationType;
};

export function calculateAvailableSlots(
  availability: any,
  appointments: AppointmentLike[],
  date: string
) {
  const day = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  }).toLowerCase();

  const daySchedule = availability.weekly?.[day];
  if (!daySchedule) return [];

  const bookedSlots = appointments.map((a) => ({
    start: new Date(a.scheduledAt),
    end: new Date(
      new Date(a.scheduledAt).getTime() +
        APPOINTMENT_DURATION[a.consultation] * 60000
    ),
  }));

  const availableSlots: string[] = [];

  for (const block of daySchedule) {
    let current = new Date(`${date}T${block.start}:00`);
    const end = new Date(`${date}T${block.end}:00`);

    while (current < end) {
      const slotEnd = new Date(
        current.getTime() + APPOINTMENT_DURATION.VIDEO * 60000
      );

      const overlaps = bookedSlots.some(
        (b) => current < b.end && slotEnd > b.start
      );

      if (!overlaps && slotEnd <= end) {
        availableSlots.push(current.toISOString());
      }

      current = new Date(current.getTime() + 15 * 60000); // 15-min increments
    }
  }

  return availableSlots;
}
