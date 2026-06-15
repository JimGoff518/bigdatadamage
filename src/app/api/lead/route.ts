import { NextResponse } from "next/server";
import { Resend } from "resend";

// Lead submissions are emailed to LEAD_EMAIL via Resend when configured.
// If env vars are missing (e.g. local dev), we fall back to a server-side log
// so nothing crashes and the form still returns success.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "Name and phone are required" }, { status: 422 });
  }

  const lead = {
    name,
    phone,
    email: String(body.email ?? ""),
    county: String(body.county ?? ""),
    concern: String(body.concern ?? ""),
    message: String(body.message ?? ""),
    at: new Date().toISOString(),
  };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL;
  const from = process.env.LEAD_FROM ?? "Big Data Damage <onboarding@resend.dev>";

  if (apiKey && to) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to,
        replyTo: lead.email || undefined,
        subject: `New lead: ${lead.name} (${lead.county || "TX"})`,
        text: [
          `New submission from BigDataDamage.com`,
          ``,
          `Name:    ${lead.name}`,
          `Phone:   ${lead.phone}`,
          `Email:   ${lead.email || "—"}`,
          `County:  ${lead.county || "—"}`,
          `Concern: ${lead.concern || "—"}`,
          ``,
          `Message:`,
          lead.message || "—",
          ``,
          `Received: ${lead.at}`,
        ].join("\n"),
      });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    } catch (err) {
      // Don't lose the lead: log it so it can be recovered from server logs.
      console.error("[lead] email send failed:", err, lead);
      return NextResponse.json({ ok: false, error: "Could not send" }, { status: 502 });
    }
  }

  // No email configured — log and accept (dev / pre-config).
  console.log("[lead] (email not configured) new submission:", lead);
  return NextResponse.json({ ok: true });
}
