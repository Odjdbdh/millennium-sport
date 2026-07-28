const SESSION_COOKIE = "millennium_admin_session";
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

export function isStrongAdminToken(secret: string | undefined) {
  return Boolean(secret && secret.length >= 16);
}

export async function hasAdminSession(request: Request, secret: string) {
  const value = readCookie(request, SESSION_COOKIE);
  if (!value) return false;

  const [expiresRaw, nonce, signature] = value.split(".");
  const expires = Number(expiresRaw);
  if (
    !expiresRaw ||
    !nonce ||
    !signature ||
    !Number.isSafeInteger(expires) ||
    expires <= Date.now()
  ) {
    return false;
  }

  const expected = await sign(`${expiresRaw}.${nonce}`, secret);
  return constantTimeEqual(signature, expected);
}

export async function createAdminSessionCookie(request: Request, secret: string) {
  const expires = Date.now() + SESSION_LIFETIME_SECONDS * 1000;
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const unsigned = `${expires}.${nonce}`;
  const signature = await sign(unsigned, secret);
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";

  return `${SESSION_COOKIE}=${unsigned}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_LIFETIME_SECONDS}${secure}`;
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

export async function adminFingerprint(request: Request) {
  const source = [
    request.headers.get("cf-connecting-ip") ?? "unknown",
    request.headers.get("user-agent") ?? "unknown",
  ].join("|");
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(source));
  return toBase64Url(new Uint8Array(digest));
}

export function adminNoStoreHeaders() {
  return {
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Referrer-Policy": "same-origin",
  };
}
