import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

export const metadata: Metadata = {
  title: {
    default: "BankNearMe.au - Find Bank Branches & ATMs Near You in Australia",
    template: "%s | BankNearMe.au",
  },
  description:
    "Find bank branches, ATMs, and banking services near you across Australia. Compare opening hours, fees, and track branch closures in your suburb.",
  keywords: [
    "bank branches Australia",
    "ATM near me",
    "bank closures",
    "find bank",
    "Commonwealth Bank branch",
    "Westpac branch",
    "ANZ branch",
    "NAB branch",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900 min-h-screen flex flex-col">
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

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  BankNearMe<span className="text-emerald-600">.au</span>
                </span>
              </Link>

              <div className="hidden md:block flex-1 max-w-md mx-8">
                <SearchBar />
              </div>

              <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  Home
                </Link>
                <Link
                  href="/#states"
                  className="hover:text-emerald-600 transition-colors"
                >
                  States
                </Link>
                <Link
                  href="/#closures"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Closures
                </Link>
              </nav>
            </div>
            <div className="md:hidden pb-3">
              <SearchBar />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-white">
                    BankNearMe<span className="text-emerald-500">.au</span>
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  Australia&apos;s most comprehensive database of bank branches,
                  ATMs, and banking services. Track closures and find
                  alternatives near you.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                  Browse by State
                </h3>
                <ul className="space-y-2 text-sm">
                  {[
                    ["New South Wales", "new-south-wales"],
                    ["Victoria", "victoria"],
                    ["Queensland", "queensland"],
                    ["Western Australia", "western-australia"],
                  ].map(([name, slug]) => (
                    <li key={slug}>
                      <Link
                        href={`/${slug}`}
                        className="hover:text-emerald-400 transition-colors"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                  More States
                </h3>
                <ul className="space-y-2 text-sm">
                  {[
                    ["South Australia", "south-australia"],
                    ["Tasmania", "tasmania"],
                    ["Northern Territory", "northern-territory"],
                    ["ACT", "australian-capital-territory"],
                  ].map(([name, slug]) => (
                    <li key={slug}>
                      <Link
                        href={`/${slug}`}
                        className="hover:text-emerald-400 transition-colors"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                  Popular Banks
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>Commonwealth Bank</li>
                  <li>Westpac</li>
                  <li>ANZ</li>
                  <li>NAB</li>
                  <li>Bendigo Bank</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <p>
                &copy; {new Date().getFullYear()} BankNearMe.au. All rights
                reserved.
              </p>
              <p>
                Data sourced from publicly available banking information. Not
                affiliated with any bank.
              </p>
            </div>
          </div>
        </footer>

        {children && null}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
