import { Resend } from "resend";

import { getEnv } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResend() {
  resendClient ??= new Resend(getEnv().RESEND_API_KEY);

  return resendClient;
}
