const SESSION_COOKIE = "millennium_story_admin";
const SESSION_LIFETIME_SECONDS = 12 * 60 * 60;
const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export function constantTimeEqual(left: string, right: string) {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  const length = Math.max(a.length, b.length);
  let mismatch = a.length ^ b.length;

  for (let index = 0; index < length; index += 1) {
    mismatch |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }

  return mismatch === 0;
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const [key, ...valueParts] = part.trim().split("=");
    if (key === name) return decodeURIComponent(valueParts.join("="));
  }
  return null;
}

export async function hasAdminSession(request: Request, secret: string) {
  const value = readCookie(request, SESSION_COOKIE);
  if (!value) return false;

  const [expiresRaw, signature] = value.split(".");
  const expires = Number(expiresRaw);
  if (!expiresRaw || !signature || !Number.isSafeInteger(expires) || expires <= Date.now()) {
    return false;
  }

  const expected = await sign(expiresRaw, secret);
  return constantTimeEqual(signature, expected);
}

export async function createAdminSessionCookie(request: Request, secret: string) {
  const expires = Date.now() + SESSION_LIFETIME_SECONDS * 1000;
  const signature = await sign(String(expires), secret);
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";

  return `${SESSION_COOKIE}=${expires}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_LIFETIME_SECONDS}${secure}`;
}

export function clearAdminSessionCookie(request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}
