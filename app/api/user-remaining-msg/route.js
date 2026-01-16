import { aj } from "@/config/Arcjet";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  const user = await currentUser();
  const userId = user?.primaryEmailAddress?.emailAddress ?? "anonymous";

  // ✅ safe body parse (prevents "Unexpected end of JSON input")
  let body = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const token = body?.token ?? 0; // how many "credits" to request
  const model = String(body?.model ?? ""); // e.g. "gemini-1.5-flash" or "cohere-command-r"

  if (model.startsWith("gemini")) {

    return NextResponse.json({ allowed: true, remainingToken: 999999 });
  }

  const decision = await aj.protect(req, {
    userId,
    requested: token,
  });

  if (decision.isDenied()) {
    return NextResponse.json({
      error: "Too many Request",
      remainingToken: decision.reason?.remaining ?? 0,
    });
  }

  return NextResponse.json({
    allowed: true,
    remainingToken: decision.reason?.remaining ?? 0,
  });
}
