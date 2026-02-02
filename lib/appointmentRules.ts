import { ConsultationType } from "@/prisma/generated/client";

export const APPOINTMENT_DURATION: Record<ConsultationType, number> = {
  VIDEO: 30,
  PHONE: 20,
  IN_PERSON: 40,
};