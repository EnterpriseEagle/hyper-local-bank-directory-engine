import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSuburbsByState, STATE_NAMES, STATE_ABBR } from "@/lib/data";

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateName = STATE_NAMES[state];
  if (!stateName) return {};

  return {
    title: `Bank Branches & ATMs in ${stateName} - Find Your Local Branch`,
    description: `Find bank branches, ATMs, and banking services across ${stateName}. Browse suburbs, compare opening hours, and track branch closures in ${STATE_ABBR[state]}.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const stateName = STATE_NAMES[state];
  if (!stateName) notFound();

  const suburbs = await getSuburbsByState(state);
  if (suburbs.length === 0) notFound();

  const stateAbbr = STATE_ABBR[state];

  const totalBranches = suburbs.reduce((s, sub) => s + sub.branchCount, 0);
  const totalAtms = suburbs.reduce((s, sub) => s + sub.atmCount, 0);
  const totalClosed = suburbs.reduce((s, sub) => s + sub.closedBranches, 0);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-gray-900">{stateName}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
            Bank Branches &amp; ATMs in {stateName}
          </h1>
          <p className="mt-4 text-lg text-emerald-100 max-w-2xl">
            Browse {suburbs.length} suburbs across {stateAbbr} to find bank
            branches, ATMs, opening hours and track recent closures.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3">
              <div className="text-2xl font-bold">{suburbs.length}</div>
              <div className="text-emerald-200 text-sm">Suburbs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3">
              <div className="text-2xl font-bold">{totalBranches}</div>
              <div className="text-emerald-200 text-sm">Open Branches</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3">
              <div className="text-2xl font-bold">{totalAtms}</div>
              <div className="text-emerald-200 text-sm">ATMs</div>
            </div>
            {totalClosed > 0 && (
              <div className="bg-red-500/20 backdrop-blur-sm rounded-lg px-5 py-3">
                <div className="text-2xl font-bold">{totalClosed}</div>
                <div className="text-red-200 text-sm">Closures</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Suburbs Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            All Suburbs in {stateName}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suburbs.map((sub) => (
              <Link
                key={sub.slug}
                href={`/${state}/${sub.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {sub.postcode}, {sub.state}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0"
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

                <div className="mt-3 flex flex-wrap gap-2">
                  {sub.branchCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
                      </svg>
                      {sub.branchCount} {sub.branchCount === 1 ? "branch" : "branches"}
                    </span>
                  )}
                  {sub.atmCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3" />
                      </svg>
                      {sub.atmCount} {sub.atmCount === 1 ? "ATM" : "ATMs"}
                    </span>
                  )}
                  {sub.closedBranches > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 text-red-700 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {sub.closedBranches} closed
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Banking Services in {stateName}
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              {stateName} has {suburbs.length} suburbs with banking services
              tracked on BankNearMe.au. Currently there are {totalBranches} open
              bank branches and {totalAtms} ATMs across the state
              {totalClosed > 0 &&
                `, with ${totalClosed} branches having recently closed`}
              .
            </p>
            <p>
              Major banks operating in {stateAbbr} include Commonwealth Bank,
              Westpac, ANZ, NAB, and regional banks like Bendigo Bank and Bank of
              Queensland. Use the suburb listings above to find detailed branch
              information including opening hours, BSB numbers, and accessibility
              features.
            </p>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Bank Branches in ${stateName}`,
            description: `Find bank branches and ATMs across ${stateName}, Australia`,
            numberOfItems: suburbs.length,
            isPartOf: {
              "@type": "WebSite",
              name: "BankNearMe.au",
            },
          }),
        }}
      />
    </div>
  );
}
