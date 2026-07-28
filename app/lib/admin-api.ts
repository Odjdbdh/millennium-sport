import { getAdminRuntime } from "./admin-runtime";
import {
  adminNoStoreHeaders,
  hasAdminSession,
  isSameOrigin,
  isStrongAdminToken,
} from "./story-auth";

export async function requireAdminRequest(request: Request, mutation = false) {
  const runtime = await getAdminRuntime();
  if (!isStrongAdminToken(runtime.ADMIN_TOKEN)) {
    return {
      runtime,
      response: Response.json(
        { error: "رمز امن مدیریت هنوز در Cloudflare تنظیم نشده است." },
        { status: 503, headers: adminNoStoreHeaders() },
      ),
    };
  }
  if (!(await hasAdminSession(request, runtime.ADMIN_TOKEN!))) {
    return {
      runtime,
      response: Response.json(
        { error: "برای ادامه وارد پنل مدیریت شوید." },
        { status: 401, headers: adminNoStoreHeaders() },
      ),
    };
  }
  if (mutation && !isSameOrigin(request)) {
    return {
      runtime,
      response: Response.json(
        { error: "درخواست نامعتبر است." },
        { status: 403, headers: adminNoStoreHeaders() },
      ),
    };
  }
  return { runtime, response: null };
}
