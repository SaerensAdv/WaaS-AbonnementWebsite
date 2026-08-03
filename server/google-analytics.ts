/**
 * Google Analytics Integration
 *
 * Uses OAuth2 refresh token for authentication.
 * Env vars:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN
 *
 * APIs used:
 * - GA4 Data API v1beta (analyticsdata.googleapis.com)
 * - Search Console API v3 (searchconsole.googleapis.com)
 * - PageSpeed Insights API v5 (no auth needed, uses API key optionally)
 */

// ─── OAuth2 Refresh Token Auth ──────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google OAuth2 credentials not configured (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Google token refresh failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };

  return cachedToken.token;
}

export function isGoogleConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
}

// ─── GA4 Data API ───────────────────────────────────────────────────────────

export interface GA4ReportRequest {
  propertyId: string;
  startDate: string; // YYYY-MM-DD or "30daysAgo"
  endDate: string;   // YYYY-MM-DD or "today"
  metrics: string[]; // e.g. ["sessions", "activeUsers", "screenPageViews"]
  dimensions?: string[]; // e.g. ["date", "pagePath"]
  limit?: number;
  orderBy?: { metric: string; desc?: boolean };
}

export interface GA4Row {
  dimensions: string[];
  metrics: string[];
}

export interface GA4ReportResponse {
  rows: GA4Row[];
  totals: string[];
  metricHeaders: string[];
  dimensionHeaders: string[];
}

export async function runGA4Report(req: GA4ReportRequest): Promise<GA4ReportResponse> {
  const token = await getAccessToken();
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${req.propertyId}:runReport`;

  const body: any = {
    dateRanges: [{ startDate: req.startDate, endDate: req.endDate }],
    metrics: req.metrics.map((m) => ({ name: m })),
  };

  if (req.dimensions?.length) {
    body.dimensions = req.dimensions.map((d) => ({ name: d }));
  }

  if (req.limit) {
    body.limit = req.limit;
  }

  if (req.orderBy) {
    body.orderBys = [{
      metric: { metricName: req.orderBy.metric },
      desc: req.orderBy.desc ?? true,
    }];
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`GA4 API error: ${response.status} ${err}`);
  }

  const data = await response.json();

  const dimensionHeaders = (data.dimensionHeaders || []).map((h: any) => h.name);
  const metricHeaders = (data.metricHeaders || []).map((h: any) => h.name);

  const rows: GA4Row[] = (data.rows || []).map((row: any) => ({
    dimensions: (row.dimensionValues || []).map((v: any) => v.value),
    metrics: (row.metricValues || []).map((v: any) => v.value),
  }));

  const totals = data.totals?.[0]?.metricValues?.map((v: any) => v.value) || [];

  return { rows, totals, metricHeaders, dimensionHeaders };
}

// ─── Search Console API ─────────────────────────────────────────────────────

export interface GSCRequest {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions?: string[]; // "query", "page", "device", "country", "date"
  rowLimit?: number;
  startRow?: number;
}

export interface GSCRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCResponse {
  rows: GSCRow[];
}

export async function queryGSC(req: GSCRequest): Promise<GSCResponse> {
  const token = await getAccessToken();
  const encodedSiteUrl = encodeURIComponent(req.siteUrl);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`;

  const body: any = {
    startDate: req.startDate,
    endDate: req.endDate,
    dimensions: req.dimensions || ["query"],
    rowLimit: req.rowLimit || 20,
    startRow: req.startRow || 0,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`GSC API error: ${response.status} ${err}`);
  }

  const data = await response.json();

  const rows: GSCRow[] = (data.rows || []).map((row: any) => ({
    keys: row.keys || [],
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));

  return { rows };
}

// ─── PageSpeed Insights API ─────────────────────────────────────────────────

export interface PSIResult {
  scores: {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
  };
  metrics: {
    fcp: string;
    lcp: string;
    tbt: string;
    cls: string;
    si: string;
  };
  opportunities: { title: string; savings: string }[];
}

export async function runPSI(url: string, strategy: "mobile" | "desktop" = "mobile"): Promise<PSIResult> {
  const apiKey = process.env.GOOGLE_PSI_API_KEY || "";
  const categories = ["performance", "seo", "accessibility", "best-practices"];

  // Build URL with multiple category params
  const baseUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
  const categoryParams = categories.map((c) => `category=${c}`).join("&");
  const fullUrl = `${baseUrl}?url=${encodeURIComponent(url)}&strategy=${strategy}&${categoryParams}${apiKey ? `&key=${apiKey}` : ""}`;

  const response = await fetch(fullUrl);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`PSI API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const cats = data.lighthouseResult?.categories || {};
  const audits = data.lighthouseResult?.audits || {};

  const scores = {
    performance: Math.round((cats.performance?.score || 0) * 100),
    seo: Math.round((cats.seo?.score || 0) * 100),
    accessibility: Math.round((cats.accessibility?.score || 0) * 100),
    bestPractices: Math.round((cats["best-practices"]?.score || 0) * 100),
  };

  const metrics = {
    fcp: audits["first-contentful-paint"]?.displayValue || "-",
    lcp: audits["largest-contentful-paint"]?.displayValue || "-",
    tbt: audits["total-blocking-time"]?.displayValue || "-",
    cls: audits["cumulative-layout-shift"]?.displayValue || "-",
    si: audits["speed-index"]?.displayValue || "-",
  };

  const opportunities = Object.values(audits)
    .filter((a: any) => a.details?.type === "opportunity" && a.score !== null && a.score < 1)
    .sort((a: any, b: any) => (a.score || 0) - (b.score || 0))
    .slice(0, 5)
    .map((a: any) => ({
      title: a.title || "",
      savings: a.details?.overallSavingsMs
        ? `${Math.round(a.details.overallSavingsMs)} ms`
        : a.displayValue || "",
    }));

  return { scores, metrics, opportunities };
}

// ─── High-level helpers for the dashboard ───────────────────────────────────

export async function getTrafficOverview(propertyId: string, days: number = 30) {
  const startDate = `${days}daysAgo`;
  const endDate = "today";

  const [dailyReport, totalsReport, topPagesReport] = await Promise.all([
    runGA4Report({
      propertyId,
      startDate,
      endDate,
      metrics: ["sessions", "activeUsers", "screenPageViews"],
      dimensions: ["date"],
    }),
    runGA4Report({
      propertyId,
      startDate,
      endDate,
      metrics: ["sessions", "activeUsers", "screenPageViews", "averageSessionDuration", "bounceRate"],
    }),
    runGA4Report({
      propertyId,
      startDate,
      endDate,
      metrics: ["screenPageViews", "activeUsers"],
      dimensions: ["pagePath"],
      limit: 10,
      orderBy: { metric: "screenPageViews", desc: true },
    }),
  ]);

  return {
    daily: dailyReport.rows.map((r) => ({
      date: r.dimensions[0],
      sessions: parseInt(r.metrics[0]) || 0,
      users: parseInt(r.metrics[1]) || 0,
      pageviews: parseInt(r.metrics[2]) || 0,
    })),
    totals: {
      sessions: parseInt(totalsReport.totals[0]) || 0,
      users: parseInt(totalsReport.totals[1]) || 0,
      pageviews: parseInt(totalsReport.totals[2]) || 0,
      avgSessionDuration: parseFloat(totalsReport.totals[3]) || 0,
      bounceRate: parseFloat(totalsReport.totals[4]) || 0,
    },
    topPages: topPagesReport.rows.map((r) => ({
      path: r.dimensions[0],
      pageviews: parseInt(r.metrics[0]) || 0,
      users: parseInt(r.metrics[1]) || 0,
    })),
  };
}

export async function getSearchOverview(siteUrl: string, days: number = 28) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const [queryData, pageData, dailyData] = await Promise.all([
    queryGSC({
      siteUrl,
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      dimensions: ["query"],
      rowLimit: 15,
    }),
    queryGSC({
      siteUrl,
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      dimensions: ["page"],
      rowLimit: 10,
    }),
    queryGSC({
      siteUrl,
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      dimensions: ["date"],
      rowLimit: days,
    }),
  ]);

  return {
    topQueries: queryData.rows.map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 1000) / 10,
      position: Math.round(r.position * 10) / 10,
    })),
    topPages: pageData.rows.map((r) => ({
      page: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 1000) / 10,
      position: Math.round(r.position * 10) / 10,
    })),
    daily: dailyData.rows.map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
    })),
  };
}
