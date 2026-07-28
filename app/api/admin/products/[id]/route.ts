import { requireAdminRequest } from "../../../../lib/admin-api";
import {
  archiveManagedProduct,
  saveManagedProduct,
} from "../../../../lib/admin-store";
import { normalizeProductInput } from "../../../../lib/product-input";
import { adminNoStoreHeaders } from "../../../../lib/story-auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { runtime, response } = await requireAdminRequest(request, true);
  if (response) return response;
  if (!runtime.STORIES_DB) {
    return Response.json(
      { error: "دیتابیس محصولات متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  const { id } = await params;
  const body = await request.json().catch(() => null) as {
    product?: unknown;
    isActive?: boolean;
  } | null;
  const product = normalizeProductInput(body?.product);
  if (!product || product.slug !== id) {
    return Response.json(
      { error: "شناسه محصول پس از ثبت قابل تغییر نیست." },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }
  await saveManagedProduct(runtime.STORIES_DB, product, body?.isActive !== false);
  return Response.json({ saved: true }, { headers: adminNoStoreHeaders() });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { runtime, response } = await requireAdminRequest(request, true);
  if (response) return response;
  if (!runtime.STORIES_DB) {
    return Response.json(
      { error: "دیتابیس محصولات متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  const { id } = await params;
  const archived = await archiveManagedProduct(runtime.STORIES_DB, id);
  return archived
    ? Response.json({ archived: true }, { headers: adminNoStoreHeaders() })
    : Response.json(
      { error: "محصول پیدا نشد." },
      { status: 404, headers: adminNoStoreHeaders() },
    );
}
