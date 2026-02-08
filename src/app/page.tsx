import Link from "next/link";
import { getStats, getStateList, getRecentClosures } from "@/lib/data";
import { STATE_NAMES } from "@/lib/data";

export default async function HomePage() {
  const [stats, states, closures] = await Promise.all([
    getStats(),
    getStateList(),
    getRecentClosures(8),
  ]);

  return (
    <div>
      {/* Hero Section - Atmospheric dark with blue glow */}
      <section className="relative flex min-h-[85vh] flex-col justify-center px-6 sm:px-10 overflow-hidden bg-black">
        {/* Dynamic Background Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-[-10%] -translate-y-[40%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(30, 58, 138, 0.8) 0%, rgba(30, 58, 138, 0) 70%)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-[-30%] -translate-y-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0) 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1000px]">
          <h1 className="mb-6 font-serif text-[clamp(2.25rem,6vw,5.5rem)] font-light leading-[1] text-white tracking-normal">
            Find Bank Branches
            <br />
            &amp; ATMs Near You.
          </h1>

          <p className="mb-8 max-w-[500px] text-[15px] font-light leading-[1.6] text-white/60">
            Search {stats.suburbs.toLocaleString()} Australian suburbs to find
            open bank branches, ATMs, opening hours, and track recent closures in
            your area.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-10 mt-12">
            {[
              { label: "Suburbs Covered", value: stats.suburbs.toLocaleString() },
              { label: "Open Branches", value: stats.openBranches.toLocaleString() },
              { label: "ATMs Available", value: stats.atms.toLocaleString() },
              { label: "Recent Closures", value: stats.closedBranches.toLocaleString() },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[clamp(1.5rem,3vw,2.5rem)] font-serif font-light text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-6 mt-12">
            <Link
              href="#states"
              className="group relative overflow-hidden border border-white/30 px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-white/70 active:scale-[0.98]"
            >
              <span className="relative z-10">Browse States</span>
              <span className="absolute inset-0 -translate-x-full bg-white/[0.03] transition-transform duration-500 group-hover:translate-x-0"></span>
            </Link>

            <Link
              href="#closures"
              className="group relative flex items-center gap-2.5 px-2 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:text-white"
            >
              <span className="underline-reveal">View Closures</span>
              <svg
                className="h-3 w-3 transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M1 6H11M11 6L6 1M11 6L6 11"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Bank Marquee */}
      <section className="relative w-full overflow-hidden border-y border-white/[0.08] py-10 bg-black">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes marqueeScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .bank-marquee {
            display: flex;
            width: max-content;
            animation: marqueeScroll 30s linear infinite;
          }
        `,
          }}
        />
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-black via-black/40 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-black via-black/40 to-transparent sm:w-32" />
        <div className="bank-marquee">
          {[
            "Commonwealth Bank",
            "Westpac",
            "ANZ",
            "NAB",
            "Bendigo Bank",
            "Bank of Queensland",
            "Suncorp",
            "Macquarie Bank",
            "ING",
            "HSBC",
          ]
            .concat([
              "Commonwealth Bank",
              "Westpac",
              "ANZ",
              "NAB",
              "Bendigo Bank",
              "Bank of Queensland",
              "Suncorp",
              "Macquarie Bank",
              "ING",
              "HSBC",
            ])
            .map((bank, i) => (
              <span
                key={i}
                className="whitespace-nowrap px-10 sm:px-14 font-sans text-[13px] font-medium tracking-wide text-white/40 sm:text-[14px]"
              >
                {bank}
              </span>
            ))}
        </div>
      </section>

      {/* Statement Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-t border-white/5 px-6 py-24 sm:px-8 sm:py-32 bg-black">
        <div className="mx-auto w-full max-w-[900px] text-center">
          <p className="mb-10 text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
            What We Track
          </p>
          <h2 className="mb-16 font-serif text-[clamp(2rem,6vw,4rem)] font-light leading-[1.15] tracking-[-0.02em] text-white">
            Banking infrastructure
            <br />
            across every suburb.
          </h2>
          <div className="mx-auto max-w-[650px] space-y-6">
            <p className="text-[16px] leading-[1.7] text-white/60 font-light">
              As Australian banks continue to close branches across suburban and
              regional areas, it has never been more important to know which
              banking services remain available in your suburb.
            </p>
            <p className="text-[16px] leading-[1.7] text-white/60 font-light">
              We track every branch, ATM, and closure so communities stay informed.
            </p>
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section id="states" className="border-t border-white/5 px-6 py-20 sm:px-10 sm:py-28 bg-black">
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans font-medium">
            Browse
          </p>
          <h2 className="mb-12 font-serif text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.1] text-white">
            States &amp; Territories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {states.map((s) => (
              <Link
                key={s.stateSlug}
                href={`/${s.stateSlug}`}
                className="group bg-black p-8 transition-all duration-500 hover:bg-white/[0.02]"
              >
                <h3 className="font-serif text-[18px] font-light text-white mb-2 transition-all duration-300 group-hover:translate-x-1">
                  {STATE_NAMES[s.stateSlug] || s.state}
                </h3>
                <p className="text-[12px] text-white/30">
                  {s.count} suburbs
                </p>
                <div className="mt-4 h-px w-0 bg-white/20 transition-all duration-700 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Closures */}
      <section id="closures" className="border-t border-white/5 px-6 py-20 sm:px-10 sm:py-28 bg-black">
        <div className="mx-auto w-full max-w-[1000px]">
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans font-medium">
            Monitoring
          </p>
          <h2 className="mb-4 font-serif text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.1] text-white">
            Recent Branch Closures
          </h2>
          <p className="mb-12 max-w-[600px] text-[15px] font-light leading-[1.7] text-white/40">
            Track bank branch closures across Australia. Stay informed about
            changes to banking services in your area.
          </p>

          {closures.length === 0 ? (
            <p className="text-white/30 text-[14px]">No recent closures recorded.</p>
          ) : (
            <div className="border-t border-white/5">
              {closures.map((c, i) => (
                <Link
                  key={i}
                  href={`/${c.stateSlug}/${c.suburbSlug}`}
                  className="group flex items-center justify-between py-5 border-b border-white/5 transition-all duration-300 hover:pl-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-[15px] font-light text-white transition-colors duration-300 group-hover:text-white/80">
                      {c.branchName}
                    </p>
                    <p className="text-[12px] text-white/30 mt-1">
                      {c.suburbName} {c.postcode}, {c.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {c.closedDate && (
                      <span className="text-[11px] text-red-400/70">
                        {c.closedDate}
                      </span>
                    )}
                    <span className="text-[14px] text-white/20 transition-all duration-300 group-hover:text-white/50 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About / SEO Content */}
      <section className="border-t border-white/5 px-6 py-20 sm:px-10 sm:py-28 bg-black">
        <div className="mx-auto w-full max-w-[640px]">
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans font-medium">
            About
          </p>
          <h2 className="mb-10 font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] font-light leading-[1.1] text-white">
            About BankNearMe.au
          </h2>
          <div className="space-y-6">
            <p className="text-[14px] font-light leading-[1.7] text-white/50">
              BankNearMe.au is Australia&apos;s most comprehensive guide to
              finding bank branches and ATMs near you. Our database covers all
              major banks including the Big Four &mdash; Commonwealth Bank,
              Westpac, ANZ, and NAB &mdash; as well as regional banks like
              Bendigo Bank, Bank of Queensland, Suncorp, and credit unions.
            </p>
            <p className="text-[14px] font-light leading-[1.7] text-white/50">
              We track opening hours, fee ratings, BSB numbers, and distance
              information to help you find the most convenient branch. We also
              track branch closures in real-time, helping communities understand
              how the banking landscape is changing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/5 px-6 py-20 sm:px-10 sm:py-28 bg-black">
        <div className="mx-auto w-full max-w-[600px] text-center">
          <h2 className="mb-6 font-serif text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.1] text-white tracking-[-0.01em]">
            Find your local branch today.
          </h2>
          <p className="mb-8 text-[14px] font-light leading-[1.7] text-white/50">
            Search by suburb or postcode to find bank branches, ATMs, and track
            closures in your area.
          </p>
          <Link
            href="#states"
            className="group relative inline-block overflow-hidden border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-white/70"
          >
            <span className="relative z-10">Explore Now</span>
            <span className="absolute inset-0 -translate-x-full bg-white/[0.03] transition-transform duration-500 group-hover:translate-x-0"></span>
          </Link>
        </div>
      </section>
    </div>
  );
}
