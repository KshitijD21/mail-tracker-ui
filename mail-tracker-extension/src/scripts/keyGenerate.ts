export function generateRandomKey(length: number = 16): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map((byte) => charset[byte % charset.length])
    .join("");
}

export async function generateTrackingId(
  userId: string,
  timestamp: number,
  key: string
): Promise<string> {
  const encoder = new TextEncoder();
  const message = encoder.encode(`${userId}:${timestamp}`);
  const keyData = encoder.encode(key);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, message);

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
