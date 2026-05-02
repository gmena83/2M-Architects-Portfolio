// Resend integration via Replit Connectors. Do NOT cache the client — tokens expire.
// Reference: Replit Resend integration blueprint.
import { Resend } from "resend";
import { logger } from "./logger";

export interface ContactEmailPayload {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

const TO_ADDRESS = "contacto@2marquitectos.cl";

interface ResendConnectionSettings {
  api_key?: string;
  from_email?: string;
}

interface ResendConnection {
  settings: ResendConnectionSettings;
}

async function getResendCredentials(): Promise<{
  apiKey: string;
  fromEmail?: string;
}> {
  const hostname = process.env["REPLIT_CONNECTORS_HOSTNAME"];
  const replIdentity = process.env["REPL_IDENTITY"];
  const webReplRenewal = process.env["WEB_REPL_RENEWAL"];

  const xReplitToken = replIdentity
    ? `repl ${replIdentity}`
    : webReplRenewal
      ? `depl ${webReplRenewal}`
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error("Replit connector credentials not available");
  }

  const response = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=resend`,
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    },
  );

  const data = (await response.json()) as { items?: ResendConnection[] };
  const connection = data.items?.[0];

  if (!connection || !connection.settings.api_key) {
    throw new Error("Resend not connected");
  }

  return {
    apiKey: connection.settings.api_key,
    fromEmail: connection.settings.from_email,
  };
}

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
  const { apiKey, fromEmail } = await getResendCredentials();
  const resend = new Resend(apiKey);

  const fromAddress =
    fromEmail ?? "2M Arquitectos <onboarding@resend.dev>";

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
