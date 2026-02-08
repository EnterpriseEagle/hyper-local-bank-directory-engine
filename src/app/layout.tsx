import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: {
    default: "BankNearMe.com.au - Is Your Bank Actually Working? Live ATM & Branch Status",
    template: "%s | BankNearMe.com.au",
  },
    description:
      "Australia's crowd-sourced bank status tracker. Report ATM outages, branch closures, and long queues in real-time across hundreds of suburbs. DownDetector for banks.",
  metadataBase: new URL("https://banknearme.com.au"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "BankNearMe.com.au",
    title: "BankNearMe.com.au - Is Your Bank Actually Working?",
    description:
      "Australia's crowd-sourced bank status tracker. Live ATM outages, branch closures, and queue reports.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BankNearMe.com.au - Live Bank Status Tracker",
    description:
      "Live crowd-sourced status for Australian banks. Report ATM outages and branch closures.",
  },
  keywords: [
    "bank branches Australia",
    "ATM near me",
    "ATM out of cash",
    "bank branch closed",
    "bank closures Australia",
    "find bank",
    "bank status",
    "ATM empty",
    "Commonwealth Bank branch",
    "Westpac branch",
    "ANZ branch",
    "NAB branch",
  ],
  other: {
    "geo.region": "AU",
    "geo.placename": "Australia",
    "ICBM": "-25.2744, 133.7751",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white min-h-screen flex flex-col">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="518c7fc1-9b6b-4c3b-9b96-b06b512bcf6c"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />

        {/* Google Analytics - only loads when GA_MEASUREMENT_ID env var is set */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}

        {/* Navigation - Fixed glassmorphism nav */}
        <nav className="fixed left-0 right-0 top-0 z-50">
          <div
            className="absolute inset-0 backdrop-blur-[32px] backdrop-saturate-150"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-10">
            <Link href="/" className="group transition-opacity hover:opacity-70 flex items-center gap-2">
              <span className="font-serif text-2xl font-light tracking-wider text-white">
                BNM
              </span>
              <span className="text-[14px] font-medium uppercase tracking-[0.1em] text-white/80">
                BankNearMe<span className="text-white/30">.au</span>
              </span>
            </Link>


              <MobileNav />
            </div>
        </nav>

        {/* Main content - offset for fixed nav */}
        <main className="flex-1 pt-[80px]">{children}</main>

        {/* Footer - Minimal dark footer */}
        <footer className="border-t border-white/5 bg-black px-6 py-12 sm:px-10 mt-auto">
          <div className="mx-auto max-w-[1000px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div>
                <span className="font-serif text-lg font-light text-white">BankNearMe</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30 ml-1">.au</span>
                <p className="mt-3 text-[13px] leading-relaxed text-white/30">
                  Australia&apos;s comprehensive database of bank branches, ATMs, and banking services.
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 mb-4">
                  Browse by State
                </p>
                <ul className="space-y-2">
                  {[
                    ["New South Wales", "new-south-wales"],
                    ["Victoria", "victoria"],
                    ["Queensland", "queensland"],
                    ["Western Australia", "western-australia"],
                  ].map(([name, slug]) => (
                    <li key={slug}>
                      <Link
                        href={`/${slug}`}
                        className="text-[12px] text-white/30 transition-colors duration-300 hover:text-white underline-reveal"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 mb-4">
                  More States
                </p>
                <ul className="space-y-2">
                  {[
                    ["South Australia", "south-australia"],
                    ["Tasmania", "tasmania"],
                    ["Northern Territory", "northern-territory"],
                    ["ACT", "australian-capital-territory"],
                  ].map(([name, slug]) => (
                    <li key={slug}>
                      <Link
                        href={`/${slug}`}
                        className="text-[12px] text-white/30 transition-colors duration-300 hover:text-white underline-reveal"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 mb-4">
                    Monitoring
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/closures"
                        className="text-[12px] text-white/30 transition-colors duration-300 hover:text-white underline-reveal"
                      >
                        Recent Branch Closures
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/#live-feed"
                        className="text-[12px] text-white/30 transition-colors duration-300 hover:text-white underline-reveal"
                      >
                        Live Status Feed
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 mb-4">
                    Popular Banks
                  </p>
                  <ul className="space-y-2">
                    {[
                      ["Commonwealth Bank", "commonwealth-bank"],
                      ["Westpac", "westpac"],
                      ["ANZ", "anz"],
                      ["NAB", "nab"],
                      ["Bendigo Bank", "bendigo-bank"],
                    ].map(([name, slug]) => (
                      <li key={slug}>
                        <Link
                          href={`/bank/${slug}`}
                          className="text-[12px] text-white/30 transition-colors duration-300 hover:text-white underline-reveal"
                        >
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>

            <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/20">
                BankNearMe.au
              </p>
              <div className="flex items-center gap-6 text-[11px] text-white/20">
                <span>&copy; {new Date().getFullYear()}</span>
                <span>Data sourced from publicly available banking information</span>
              </div>
            </div>
          </div>
        </footer>

        {children && null}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
