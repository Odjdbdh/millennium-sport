import {
  clearLoginFailures,
  loginLockRemaining,
  recordLoginFailure,
} from "../../../lib/admin-store";
import { getAdminRuntime } from "../../../lib/admin-runtime";
import {
  adminFingerprint,
  adminNoStoreHeaders,
  clearAdminSessionCookie,
  constantTimeEqual,
  createAdminSessionCookie,
  hasAdminSession,
  isSameOrigin,
  isStrongAdminToken,
} from "../../../lib/story-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const runtime = await getAdminRuntime();
  const configured = isStrongAdminToken(runtime.ADMIN_TOKEN);
  return Response.json(
    {
      authenticated: configured
        ? await hasAdminSession(request, runtime.ADMIN_TOKEN!)
        : false,
      configured,
      storageReady: Boolean(runtime.STORIES_DB && runtime.STORY_MEDIA),
    },
    {
      status: configured ? 200 : 503,
      headers: adminNoStoreHeaders(),
    },
  );
}

export async function POST(request: Request) {
  const runtime = await getAdminRuntime();
  if (!isStrongAdminToken(runtime.ADMIN_TOKEN)) {
    return Response.json(
      { error: "یک رمز حداقل ۱۶ کاراکتری برای ADMIN_TOKEN در Cloudflare تنظیم کنید." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  if (!isSameOrigin(request)) {
    return Response.json(
      { error: "درخواست نامعتبر است." },
      { status: 403, headers: adminNoStoreHeaders() },
    );
  }

  const fingerprint = await adminFingerprint(request);
  if (runtime.STORIES_DB) {
    const remaining = await loginLockRemaining(runtime.STORIES_DB, fingerprint);
    if (remaining > 0) {
      return Response.json(
        { error: "به‌دلیل تلاش‌های ناموفق، ورود موقتاً قفل شده است.", retryAfter: remaining },
        {
          status: 429,
          headers: {
            ...adminNoStoreHeaders(),
            "Retry-After": String(Math.ceil(remaining / 1000)),
          },
        },
      );
    }
  }

  const payload = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = payload?.password ?? "";
  if (!constantTimeEqual(password, runtime.ADMIN_TOKEN!)) {
    if (runtime.STORIES_DB) {
      await recordLoginFailure(runtime.STORIES_DB, fingerprint);
    }
    return Response.json(
      { error: "رمز مدیریت نادرست است." },
      { status: 401, headers: adminNoStoreHeaders() },
    );
  }

  if (runtime.STORIES_DB) {
    await clearLoginFailures(runtime.STORIES_DB, fingerprint);
  }
  const response = Response.json(
    { authenticated: true },
    { headers: adminNoStoreHeaders() },
  );
  response.headers.set(
    "Set-Cookie",
    await createAdminSessionCookie(request, runtime.ADMIN_TOKEN!),
  );
  return response;
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json(
      { error: "درخواست نامعتبر است." },
      { status: 403, headers: adminNoStoreHeaders() },
    );
  }
  const response = Response.json(
    { authenticated: false },
    { headers: adminNoStoreHeaders() },
  );
  response.headers.set("Set-Cookie", clearAdminSessionCookie(request));
  return response;
}
