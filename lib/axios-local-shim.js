"use client";

// LOCAL DEV SHIM — no backend.
// Makes every axios call to the (missing) API return empty data
// instead of throwing a 404, so pages load clean.
// Import this ONCE, high up (e.g. in redux/provider.jsx).
// Delete this import when you connect a real backend.

import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_URL || "";

// If there is no real backend configured, short-circuit all API calls.
const NO_BACKEND =
  !base ||
  base.includes("localhost:3000") || // points at the frontend itself
  base.trim() === "";

if (NO_BACKEND && typeof window !== "undefined") {
  axios.interceptors.request.use((config) => {
    const url = config.url || "";
    // Only intercept calls to the missing admin/backend API,
    // never Next.js local routes (/api/users, /api/governing-council, etc.)
    const isBackend =
      url.includes("/api/admin") ||
      url.includes("/api/auth") ||
      (base && url.startsWith(base));

    if (isBackend) {
      // Mark it so the response interceptor can fake a reply
      config.__localEmpty = true;
      // Point it somewhere harmless that won't resolve on the network;
      // the adapter below returns before any request goes out.
      config.adapter = async (cfg) => ({
        data: { data: [], success: true, message: "local-empty" },
        status: 200,
        statusText: "OK (local)",
        headers: {},
        config: cfg,
        request: {},
      });
    }
    return config;
  });
}

export default axios;