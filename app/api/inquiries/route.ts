import { createInquiry } from "../../lib/admin-store";
import { getAdminRuntime } from "../../lib/admin-runtime";

export const dynamic = "force-dynamic";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const runtime = await getAdminRuntime();
  if (!runtime.STORIES_DB) {
    return Response.json({ stored: false }, { status: 202 });
  }
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || clean(body.website, 10)) {
    return Response.json({ stored: true }, { status: 201 });
  }
  const input = {
    name: clean(body.name, 100),
    business: clean(body.business, 140),
    province: clean(body.province, 80),
    city: clean(body.city, 80),
    phone: clean(body.phone, 30),
    product: clean(body.product, 180),
    details: clean(body.details, 1_500),
  };
  if (
    !input.name ||
    !input.business ||
    !input.province ||
    !input.city ||
    !/^(\+98|0)?9\d{9}$/.test(input.phone.replace(/[\s-]/g, ""))
  ) {
    return Response.json(
      { error: "اطلاعات درخواست کامل یا معتبر نیست." },
      { status: 400 },
    );
  }
  const id = await createInquiry(runtime.STORIES_DB, input);
  return Response.json({ stored: true, id }, { status: 201 });
}
