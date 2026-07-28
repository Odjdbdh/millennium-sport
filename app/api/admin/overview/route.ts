import { requireAdminRequest } from "../../../lib/admin-api";
import { getDashboardStats } from "../../../lib/admin-store";
import { adminNoStoreHeaders } from "../../../lib/story-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { runtime, response } = await requireAdminRequest(request);
  if (response) return response;
  if (!runtime.STORIES_DB) {
    return Response.json(
      { error: "دیتابیس سایت هنوز متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  try {
    return Response.json(
      { stats: await getDashboardStats(runtime.STORIES_DB) },
      { headers: adminNoStoreHeaders() },
    );
  } catch {
    return Response.json(
      { error: "دریافت آمار پنل ممکن نشد." },
      { status: 500, headers: adminNoStoreHeaders() },
    );
  }
}
