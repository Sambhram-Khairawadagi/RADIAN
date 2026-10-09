import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/enquiry-schema";
import { checkRateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
const respond = (status: number, error: string) =>
  NextResponse.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowed = new Set<string>();
  if (process.env.NODE_ENV === "development") {
    allowed.add("http://127.0.0.1:3000");
    allowed.add("http://localhost:3000");
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {
      /* Invalid configuration fails closed below. */
    }
  }
  if (!origin || !allowed.has(origin))
    return respond(
      403,
      "This request could not be verified. Please use the website enquiry form.",
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return respond(415, "Please send a valid enquiry.");
  if (Number(request.headers.get("content-length")) > 16000)
    return respond(413, "This enquiry is too long.");
  let raw = "";
  try {
    const reader = request.body?.getReader();
    if (!reader) return respond(400, "Please complete the form.");
    const decoder = new TextDecoder();
    let bytes = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16000) {
        await reader.cancel();
        return respond(413, "This enquiry is too long.");
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } catch {
    return respond(400, "Please complete the form and try again.");
  }
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return respond(400, "Please send a valid enquiry.");
  }
  const parsed = enquirySchema.safeParse(value);
  if (!parsed.success)
    return respond(400, "Please check your contact details and consent.");
  const data = parsed.data;
  const elapsed = Date.now() - data.startedAt;
  if (elapsed < 1500 || elapsed > 86400000)
    return respond(
      400,
      "Please take a moment to review the form, then try again. Refresh if this page has been open for a day.",
    );
  const apiKey = process.env.RESEND_API_KEY,
    from = process.env.LEAD_FROM_EMAIL,
    to = process.env.LEAD_TO_EMAIL;
  if (!apiKey || !from || !to)
    return respond(
      503,
      "Online enquiries are not connected yet. Please call or email the project team. Your enquiry has not been sent.",
    );
  const ip =
    process.env.TRUST_PROXY === "true"
      ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        "unknown"
      : "local";
  const limit = await checkRateLimit(ip);
  if (limit === "unavailable")
    return respond(
      503,
      "Online enquiries are temporarily unavailable. Please call or email the project team.",
    );
  if (limit === "limited")
    return NextResponse.json(
      {
        error:
          "Too many attempts. Please try again in 15 minutes, or contact the team directly.",
      },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `RADIAN enquiry${data.floor ? " — Floor " + data.floor : ""}`,
        text: `Name: ${data.name}\nMobile: ${data.phone}\nEmail: ${data.email}\nInterested floor: ${data.floor || "Not specified"}\nMessage: ${data.message || "None"}\nConsent to respond: yes\nConsent wording: contact about this Radian enquiry, privacy-v1\nReceived: ${new Date().toISOString()}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      return respond(
        502,
        "The enquiry service could not accept your request. Please try again or contact the team directly.",
      );
    const result = await response.json();
    if (!result.id)
      return respond(
        502,
        "Delivery could not be confirmed. Please contact the team directly.",
      );
    return NextResponse.json(
      {
        ok: true,
        message:
          "Your enquiry has been accepted for delivery to the project team.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return respond(
      502,
      "Delivery could not be confirmed. Please contact the team directly before trying again.",
    );
  }
}
