import {
  clearAdminSessionCookie,
  constantTimeEqual,
  createAdminSessionCookie,
  hasAdminSession,
  isSameOrigin,
} from "../../../lib/story-auth";
import { getStoryRuntime } from "../../../lib/story-runtime";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { ADMIN_TOKEN } = await getStoryRuntime();
  if (!ADMIN_TOKEN) {
    return Response.json(
      { authenticated: false, configured: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    { authenticated: await hasAdminSession(request, ADMIN_TOKEN), configured: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const { ADMIN_TOKEN } = await getStoryRuntime();
  if (!ADMIN_TOKEN) {
    return Response.json({ error: "رمز مدیریت در Cloudflare تنظیم نشده است." }, { status: 503 });
  }
  if (!isSameOrigin(request)) {
    return Response.json({ error: "درخواست نامعتبر است." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = payload?.password ?? "";
  if (!constantTimeEqual(password, ADMIN_TOKEN)) {
    return Response.json({ error: "رمز مدیریت نادرست است." }, { status: 401 });
  }

  const response = Response.json({ authenticated: true });
  response.headers.set("Set-Cookie", await createAdminSessionCookie(request, ADMIN_TOKEN));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "درخواست نامعتبر است." }, { status: 403 });
  }

  const response = Response.json({ authenticated: false });
  response.headers.set("Set-Cookie", clearAdminSessionCookie(request));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
