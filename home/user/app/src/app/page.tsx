import Link from "next/link";
import { getStats, getStateList, getRecentClosures } from "@/lib/data";
import { STATE_NAMES } from "@/lib/data";

const STATE_ICONS: Record<string, string> = {
  "new-south-wales": "🏙️",
  victoria: "🏛️",
  queensland: "☀️",
  "western-australia": "⛏️",
  "south-australia": "🍷",
  tasmania: "🌿",
  "northern-territory": "🐊",
  "australian-capital-territory": "🏛️",
};

export default async function HomePage() {
  const [stats, states, closures] = await Promise.all([
    getStats(),
    getStateList(),
    getRecentClosures(8),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Find Bank Branches &amp; ATMs
              <span className="text-emerald-200"> Near You</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-emerald-100 leading-relaxed max-w-2xl">
              Search {stats.suburbs.toLocaleString()} Australian suburbs to find
              open bank branches, ATMs, opening hours, and track recent
              closures in your area.
            </p>
          </div>

          {/* Stats bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                label: "Suburbs Covered",
                value: stats.suburbs.toLocaleString(),
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                ),
              },
              {
                label: "Open Branches",
                value: stats.openBranches.toLocaleString(),
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
                  </svg>
                ),
              },
              {
                label: "ATMs Available",
                value: stats.atms.toLocaleString(),
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                ),
              },
              {
                label: "Recent Closures",
                value: stats.closedBranches.toLocaleString(),
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                ),
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5"
              >
                <div className="text-emerald-200 mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-emerald-200 text-sm mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section id="states" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Browse by State & Territory
            </h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              Select your state to find bank branches and ATMs in your local
              suburb
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {states.map((s) => (
              <Link
                key={s.stateSlug}
                href={`/${s.stateSlug}`}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl">
                      {STATE_ICONS[s.stateSlug] || "📍"}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {STATE_NAMES[s.stateSlug] || s.state}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {s.count} suburbs
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Closures */}
      <section id="closures" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Recent Branch Closures
            </h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              Track bank branch closures across Australia. Stay informed about
              changes to banking services in your area.
            </p>
          </div>

          {closures.length === 0 ? (
            <p className="text-center text-gray-500">
              No recent closures recorded.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {closures.map((c, i) => (
                <Link
                  key={i}
                  href={`/${c.stateSlug}/${c.suburbSlug}`}
                  className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-red-200 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                      {c.branchName}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {c.suburbName} {c.postcode}, {c.state}
                    </p>
                    {c.closedDate && (
                      <span className="inline-block mt-2 text-xs font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                        Closed {c.closedDate}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content Block */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            About BankNearMe.au
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              BankNearMe.au is Australia&apos;s most comprehensive guide to
              finding bank branches and ATMs near you. As Australian banks
              continue to close branches across suburban and regional areas, it
              has never been more important to know which banking services
              remain available in your suburb.
            </p>
            <p>
              Our database covers all major banks including the Big Four &mdash;
              Commonwealth Bank, Westpac, ANZ, and NAB &mdash; as well as
              regional banks like Bendigo Bank, Bank of Queensland, Suncorp,
              and credit unions. We track opening hours, fee ratings, BSB
              numbers, and distance information to help you find the most
              convenient branch.
            </p>
            <p>
              We also track branch closures in real-time, helping communities
              understand how the banking landscape is changing. Whether
              you&apos;re looking for a branch with Saturday hours, a fee-free
              ATM, or want to know if your local branch has closed, BankNearMe
              has you covered.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
