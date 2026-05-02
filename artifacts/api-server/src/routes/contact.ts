import { Router, type IRouter } from "express";
import { SubmitContactBody, SubmitContactResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { sendContactEmail } from "../lib/email";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Datos inválidos. Por favor revisa los campos del formulario.",
    });
  }

  try {
    await sendContactEmail(parsed.data);
    const data = SubmitContactResponse.parse({ ok: true });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Failed to send contact email");
    return res.status(500).json({
      error:
        "No pudimos enviar tu mensaje en este momento. Inténtalo nuevamente más tarde.",
    });
  }
});

export default router;
