import { requireAdminRequest } from "../../../lib/admin-api";
import { listInquiries } from "../../../lib/admin-store";
import { adminNoStoreHeaders } from "../../../lib/story-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { runtime, response } = await requireAdminRequest(request);
  if (response) return response;
  if (!runtime.STORIES_DB) {
    return Response.json(
      { error: "دیتابیس درخواست‌ها متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  return Response.json(
    { orders: await listInquiries(runtime.STORIES_DB) },
    { headers: adminNoStoreHeaders() },
  );
}
