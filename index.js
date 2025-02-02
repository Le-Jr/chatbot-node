import { create } from "@wppconnect-team/wppconnect";
import "dotenv/config";

async function initNewClientSession(clientId) {
  try {
    const client = await create({
      session: `${process.env}`,
    });
  } catch (err) {}
}
