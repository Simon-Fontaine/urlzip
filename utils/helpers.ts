export function toDateTime(secs: number) {
  const time = new Date(+0);
  time.setSeconds(secs);
  return time;
}

export function generateURL(path: string = "") {
  const site_url = process.env.NEXT_PUBLIC_SITE_URL;
  const cleaned_site_url = site_url && site_url.trim() !== "" ? site_url : null;

  const vercel_url = process.env.NEXT_PUBLIC_VERCEL_URL;
  const cleaned_vercel_url =
    vercel_url && vercel_url.trim() !== "" ? vercel_url : null;

  let url = cleaned_site_url || cleaned_vercel_url || "http://localhost:3000";

  url = url.replace(/\/+$/, "");
  url = url.includes("http") ? url : `https://${url}`;
  path = path.replace(/^\/+/, "");

  return path ? `${url}/${path}` : url;
}

export function calculateTrialEnd(days: number | null | undefined) {
  if (days === null || days === undefined || days < 2) return undefined;

  const now = new Date();
  const endDate = new Date(now.getTime() + (days + 1) * 24 * 60 * 60 * 1000);

  return Math.floor(endDate.getTime() / 1000);
}
