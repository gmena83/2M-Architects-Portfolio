// Spanish-localized wrapper around the generated contact contract schema.
// We re-derive a Zod schema with Spanish messages while keeping the same
// constraints as the OpenAPI/generated source of truth.
import { z } from "zod";
import {
  SubmitContactBody,
  submitContactBodyNombreMin,
  submitContactBodyNombreMax,
  submitContactBodyEmailMax,
  submitContactBodyTelefonoMax,
  submitContactBodyMensajeMin,
  submitContactBodyMensajeMax,
} from "@workspace/api-zod";

export type ContactFormValues = z.infer<typeof SubmitContactBody>;

export const ContactFormSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(submitContactBodyNombreMin, {
      message: `El nombre debe tener al menos ${submitContactBodyNombreMin} caracteres.`,
    })
    .max(submitContactBodyNombreMax, {
      message: `El nombre no puede superar los ${submitContactBodyNombreMax} caracteres.`,
    }),
  email: z
    .string({ required_error: "El correo electrónico es obligatorio." })
    .email({ message: "Ingresa un correo electrónico válido." })
    .max(submitContactBodyEmailMax, {
      message: `El correo no puede superar los ${submitContactBodyEmailMax} caracteres.`,
    }),
  telefono: z
    .string()
    .max(submitContactBodyTelefonoMax, {
      message: `El teléfono no puede superar los ${submitContactBodyTelefonoMax} caracteres.`,
    })
    .optional(),
  mensaje: z
    .string({ required_error: "El mensaje es obligatorio." })
    .min(submitContactBodyMensajeMin, {
      message: `El mensaje debe tener al menos ${submitContactBodyMensajeMin} caracteres.`,
    })
    .max(submitContactBodyMensajeMax, {
      message: `El mensaje no puede superar los ${submitContactBodyMensajeMax} caracteres.`,
    }),
}) satisfies z.ZodType<ContactFormValues>;
