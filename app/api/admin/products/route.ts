import { requireAdminRequest } from "../../../lib/admin-api";
import { listManagedProducts, saveManagedProduct } from "../../../lib/admin-store";
import { normalizeProductInput } from "../../../lib/product-input";
import { adminNoStoreHeaders } from "../../../lib/story-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { runtime, response } = await requireAdminRequest(request);
  if (response) return response;
  if (!runtime.STORIES_DB) {
    return Response.json(
      { error: "دیتابیس محصولات متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  return Response.json(
    { products: await listManagedProducts(runtime.STORIES_DB, true) },
    { headers: adminNoStoreHeaders() },
  );
}

export async function POST(request: Request) {
  const { runtime, response } = await requireAdminRequest(request, true);
  if (response) return response;
  if (!runtime.STORIES_DB) {
    return Response.json(
      { error: "دیتابیس محصولات متصل نشده است." },
      { status: 503, headers: adminNoStoreHeaders() },
    );
  }
  const body = await request.json().catch(() => null) as {
    product?: unknown;
    isActive?: boolean;
  } | null;
  const product = normalizeProductInput(body?.product);
  if (!product) {
    return Response.json(
      { error: "اطلاعات محصول کامل یا معتبر نیست." },
      { status: 400, headers: adminNoStoreHeaders() },
    );
  }
  await saveManagedProduct(runtime.STORIES_DB, product, body?.isActive !== false);
  return Response.json(
    { saved: true, id: product.slug },
    { status: 201, headers: adminNoStoreHeaders() },
  );
}
