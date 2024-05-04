"use client";

import { Analytics as PageAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function Analytics() {
  return (
    <>
      <PageAnalytics />
      <SpeedInsights />
    </>
  );
}
