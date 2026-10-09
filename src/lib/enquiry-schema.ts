import { z } from "zod";
export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Please use fewer than 100 characters."),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{8,25}$/, "Please enter a valid mobile number.")
    .refine((v) => {
      const n = v.replace(/\D/g, "");
      return n.length >= 8 && n.length <= 15;
    }, "Use 8–15 digits, including your country code."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254),
  floor: z.enum(["", "B", "G", "1", "2", "3", "4", "5"]),
  message: z
    .string()
    .trim()
    .max(2000, "Please keep your message under 2,000 characters."),
  consent: z
    .boolean()
    .refine((v) => v, "Please agree so the project team can respond."),
  website: z.string().max(0, "Unable to accept this request."),
  startedAt: z.number().finite().positive(),
});
export type EnquiryValues = z.infer<typeof enquirySchema>;
