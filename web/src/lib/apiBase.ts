/** API origin for browser requests. Empty string = same origin (Next.js rewrites to the Hono API). */
export const getApiBase = (): string => {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (raw === "" || raw === "same-origin") {
    return "";
  }
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "";
};
