import { Resend } from "resend";
import { logger } from "./logger";

export interface ContactEmailPayload {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

const TO_ADDRESS = "contacto@2marquitectos.cl";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(
  payload: ContactEmailPayload,
): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured. Add the Resend integration in Replit.",
    );
  }

  const fromAddress =
    process.env["CONTACT_FROM_ADDRESS"] ?? "2M Arquitectos <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  const subject = `Nuevo mensaje desde el sitio · ${payload.nombre}`;

  const text = [
    `Nombre: ${payload.nombre}`,
    `Email: ${payload.email}`,
    payload.telefono ? `Teléfono: ${payload.telefono}` : null,
    "",
    "Mensaje:",
    payload.mensaje,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111;">
      <h2 style="margin:0 0 16px;">Nuevo mensaje · 2M Arquitectos</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(payload.nombre)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      ${payload.telefono ? `<p><strong>Teléfono:</strong> ${escapeHtml(payload.telefono)}</p>` : ""}
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(payload.mensaje)}</p>
    </div>
  `;

  const result = await resend.emails.send({
    from: fromAddress,
    to: TO_ADDRESS,
    replyTo: payload.email,
    subject,
    text,
    html,
  });

  if (result.error) {
    logger.error({ err: result.error }, "Resend rejected contact email");
    throw new Error(result.error.message ?? "Email send failed");
  }
}
