import { createHash } from "node:crypto";
const local = new Map<string, { count: number; expires: number }>();
const windowSeconds = 900;
export async function checkRateLimit(ip: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const salt = process.env.RATE_LIMIT_SALT;
  if (process.env.NODE_ENV === "production" && (!url || !token || !salt))
    return "unavailable" as const;
  const key =
    "radian:lead:" +
    createHash("sha256")
      .update(`${salt || "local-only"}:${ip}`)
      .digest("hex");
  if (url && token) {
    try {
      const script =
        "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["EVAL", script, "1", key, String(windowSeconds)]),
        signal: AbortSignal.timeout(5000),
        cache: "no-store",
      });
      if (!response.ok) return "unavailable" as const;
      const data = await response.json();
      if (typeof data.result !== "number") return "unavailable" as const;
      return data.result <= 5 ? ("allowed" as const) : ("limited" as const);
    } catch {
      return "unavailable" as const;
    }
  }
  const now = Date.now();
  for (const [k, v] of local) {
    if (v.expires < now) local.delete(k);
  }
  if (local.size > 10000) local.clear();
  const previous = local.get(key);
  const entry =
    previous && previous.expires > now
      ? previous
      : { count: 0, expires: now + windowSeconds * 1000 };
  entry.count++;
  local.set(key, entry);
  return entry.count <= 5 ? ("allowed" as const) : ("limited" as const);
}
