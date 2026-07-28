import { requireAdminRequest } from "../../../../lib/admin-api";
import {
  type InquiryStatus,
  updateInquiryStatus,
} from "../../../../lib/admin-store";
import { adminNoStoreHeaders } from "../../../../lib/story-auth";

const statuses = new Set<InquiryStatus>([
  "new",
  "contacted",
  "quoted",
  "completed",
  "cancelled",
]);

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { runtime, response } = await requireAdminRequest(request, true);
  if (response) return response;
  if (!runtime.STORIES_DB) {
    return Response.json(
      { error: "دیتابیس درخواست‌ها متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  const body = await request.json().catch(() => null) as { status?: InquiryStatus } | null;
  if (!body?.status || !statuses.has(body.status)) {
    return Response.json(
      { error: "وضعیت انتخاب‌شده معتبر نیست." },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }
  const { id } = await params;
  const updated = await updateInquiryStatus(runtime.STORIES_DB, id, body.status);
  return updated
    ? Response.json({ updated: true }, { headers: adminNoStoreHeaders() })
    : Response.json(
      { error: "درخواست پیدا نشد." },
      { status: 404, headers: adminNoStoreHeaders() },
    );
}
