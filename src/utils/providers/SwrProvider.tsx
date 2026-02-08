"use client";

/**
 * SwrProvider.tsx
 *
 * Wrap your app root with this once.  It gives every useSWR() call in the tree
 * a shared fetcher so individual hooks don't have to pass one.
 *
 *   // app/layout.tsx  (Next.js App Router)
 *   import { SwrProvider } from "@/components/roadmap";
 *
 *   export default function RootLayout({ children }) {
 *     return <SwrProvider>{children}</SwrProvider>;
 *   }
 *
 * The fetcher is intentionally generic – it does a plain GET and parses JSON.
 * Mutation endpoints (PATCH / POST / DELETE) are called directly via the
 * roadmapApi helpers; they are NOT routed through this fetcher.
 */

import { SWRConfig } from "swr";
import { ReactNode } from "react";

/** Generic GET fetcher.  `url` is whatever string key you pass to useSWR(). */
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    // SWR expects thrown errors to be Error instances for the `error` field
    let msg = `HTTP ${res.status}`;
    try {
      const text = await res.text();
      if (text) msg += ` – ${text}`;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json();
}

export default function SwrProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        // revalidate on window focus so tabs stay in sync
        revalidateOnFocus: true,
        // don't hammer the server on every mount if data is fresh
        dedupingInterval: 5_000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
