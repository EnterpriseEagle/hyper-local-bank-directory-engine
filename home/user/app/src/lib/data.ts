import { db } from "./db";
import { suburbs, branches, banks, statusReports } from "./db/schema";
import { eq, sql, and, desc, asc, ne, like } from "drizzle-orm";

export const STATE_NAMES: Record<string, string> = {
  "new-south-wales": "New South Wales",
  victoria: "Victoria",
  queensland: "Queensland",
  "western-australia": "Western Australia",
  "south-australia": "South Australia",
  tasmania: "Tasmania",
  "northern-territory": "Northern Territory",
  "australian-capital-territory": "Australian Capital Territory",
};

export const STATE_ABBR: Record<string, string> = {
  "new-south-wales": "NSW",
  victoria: "VIC",
  queensland: "QLD",
  "western-australia": "WA",
  "south-australia": "SA",
  tasmania: "TAS",
  "northern-territory": "NT",
  "australian-capital-territory": "ACT",
};

export async function getStats() {
  const [suburbCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(suburbs);
  const [branchCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(branches)
    .where(and(eq(branches.type, "branch"), eq(branches.status, "open")));
  const [closedCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(branches)
    .where(and(eq(branches.type, "branch"), eq(branches.status, "closed")));
  const [atmCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(branches)
    .where(and(eq(branches.type, "atm"), eq(branches.status, "open")));
  const [reportCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(statusReports);

  return {
    suburbs: suburbCount.count,
    openBranches: branchCount.count,
    closedBranches: closedCount.count,
    atms: atmCount.count,
    totalReports: reportCount.count,
  };
}

export async function getStateList() {
  const results = await db
    .select({
      stateSlug: suburbs.stateSlug,
      state: suburbs.state,
      count: sql<number>`count(*)`,
    })
    .from(suburbs)
    .groupBy(suburbs.stateSlug, suburbs.state)
    .orderBy(asc(suburbs.state));
  return results;
}

export async function getSuburbsByState(stateSlug: string) {
  return db
    .select()
    .from(suburbs)
    .where(eq(suburbs.stateSlug, stateSlug))
    .orderBy(asc(suburbs.name));
}

export async function getSuburbBySlug(slug: string) {
  const [suburb] = await db
    .select()
    .from(suburbs)
    .where(eq(suburbs.slug, slug))
    .limit(1);
  return suburb;
}

export async function getBranchesForSuburb(suburbId: number) {
  return db
    .select({
      id: branches.id,
      name: branches.name,
      address: branches.address,
      lat: branches.lat,
      lng: branches.lng,
      type: branches.type,
      status: branches.status,
      bsb: branches.bsb,
      openingHours: branches.openingHours,
      closedDate: branches.closedDate,
      distanceKm: branches.distanceKm,
      feeRating: branches.feeRating,
      bankName: banks.name,
      bankSlug: banks.slug,
      bankType: banks.type,
    })
    .from(branches)
    .innerJoin(banks, eq(branches.bankId, banks.id))
    .where(eq(branches.suburbId, suburbId))
    .orderBy(asc(branches.distanceKm));
}

export async function searchSuburbs(query: string, limit = 10) {
  return db
    .select()
    .from(suburbs)
    .where(sql`lower(${suburbs.name}) LIKE ${`%${query.toLowerCase()}%`} OR ${suburbs.postcode} LIKE ${`%${query}%`}`)
    .limit(limit)
    .orderBy(asc(suburbs.name));
}

export async function getAllSuburbSlugs() {
  return db
    .select({ slug: suburbs.slug, stateSlug: suburbs.stateSlug })
    .from(suburbs);
}

export async function getRecentClosures(limit = 10) {
  return db
    .select({
      branchName: branches.name,
      closedDate: branches.closedDate,
      suburbName: suburbs.name,
      postcode: suburbs.postcode,
      state: suburbs.state,
      suburbSlug: suburbs.slug,
      stateSlug: suburbs.stateSlug,
    })
    .from(branches)
    .innerJoin(suburbs, eq(branches.suburbId, suburbs.id))
    .where(eq(branches.status, "closed"))
    .limit(limit);
}

export async function getNearbySuburbs(suburbId: number, stateSlug: string, limit = 6) {
  return db
    .select()
    .from(suburbs)
    .where(and(eq(suburbs.stateSlug, stateSlug), ne(suburbs.id, suburbId)))
    .limit(limit)
    .orderBy(sql`RANDOM()`);
}

export async function getRecentReportsForSuburb(suburbId: number, limit = 10) {
  return db
    .select({
      id: statusReports.id,
      reportType: statusReports.reportType,
      createdAt: statusReports.createdAt,
      branchName: branches.name,
      branchType: branches.type,
    })
    .from(statusReports)
    .innerJoin(branches, eq(statusReports.branchId, branches.id))
    .where(eq(statusReports.suburbId, suburbId))
    .orderBy(desc(statusReports.createdAt))
    .limit(limit);
}

export async function getReportCountForSuburb(suburbId: number) {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(statusReports)
    .where(eq(statusReports.suburbId, suburbId));
  return result.count;
}

export async function submitStatusReport(data: {
  branchId: number;
  suburbId: number;
  reportType: string;
  ipHash?: string;
}) {
  return db.insert(statusReports).values({
    branchId: data.branchId,
    suburbId: data.suburbId,
    reportType: data.reportType,
    createdAt: new Date().toISOString(),
    ipHash: data.ipHash || null,
  });
}

export async function getClosureStatsForState(stateSlug: string) {
  const [result] = await db
    .select({
      totalClosed: sql<number>`count(*)`,
    })
    .from(branches)
    .innerJoin(suburbs, eq(branches.suburbId, suburbs.id))
    .where(and(eq(suburbs.stateSlug, stateSlug), eq(branches.status, "closed")));
  return result.totalClosed;
}

export async function getTopClosureSuburbs(limit = 10) {
  return db
    .select({
      name: suburbs.name,
      postcode: suburbs.postcode,
      state: suburbs.state,
      slug: suburbs.slug,
      stateSlug: suburbs.stateSlug,
      closedBranches: suburbs.closedBranches,
    })
    .from(suburbs)
    .where(sql`${suburbs.closedBranches} > 0`)
    .orderBy(desc(suburbs.closedBranches))
    .limit(limit);
}

export async function getRecentReportsGlobal(limit = 20) {
  return db
    .select({
      id: statusReports.id,
      reportType: statusReports.reportType,
      createdAt: statusReports.createdAt,
      branchName: branches.name,
      branchType: branches.type,
      suburbName: suburbs.name,
      postcode: suburbs.postcode,
      state: suburbs.state,
      suburbSlug: suburbs.slug,
      stateSlug: suburbs.stateSlug,
    })
    .from(statusReports)
    .innerJoin(branches, eq(statusReports.branchId, branches.id))
    .innerJoin(suburbs, eq(statusReports.suburbId, suburbs.id))
    .orderBy(desc(statusReports.createdAt))
    .limit(limit);
}

export async function getLiveOutageStats() {
  const [atmEmpty] = await db
    .select({ count: sql<number>`count(*)` })
    .from(statusReports)
    .where(eq(statusReports.reportType, "atm_empty"));
  const [branchClosed] = await db
    .select({ count: sql<number>`count(*)` })
    .from(statusReports)
    .where(eq(statusReports.reportType, "branch_closed"));
  const [longQueue] = await db
    .select({ count: sql<number>`count(*)` })
    .from(statusReports)
    .where(eq(statusReports.reportType, "long_queue"));
  const [working] = await db
    .select({ count: sql<number>`count(*)` })
    .from(statusReports)
    .where(eq(statusReports.reportType, "working"));

  return {
    atmEmpty: atmEmpty.count,
    branchClosed: branchClosed.count,
    longQueue: longQueue.count,
    working: working.count,
  };
}

export async function getOutageHotspots(limit = 8) {
  // Suburbs with the most non-working reports
  const results = await db
    .select({
      suburbName: suburbs.name,
      postcode: suburbs.postcode,
      state: suburbs.state,
      suburbSlug: suburbs.slug,
      stateSlug: suburbs.stateSlug,
      reportCount: sql<number>`count(*)`,
    })
    .from(statusReports)
    .innerJoin(suburbs, eq(statusReports.suburbId, suburbs.id))
    .where(sql`${statusReports.reportType} != 'working'`)
    .groupBy(suburbs.id, suburbs.name, suburbs.postcode, suburbs.state, suburbs.slug, suburbs.stateSlug)
      .orderBy(sql`count(*) DESC`)
      .limit(limit);
    return results;
}

// ===== BANK PAGE DATA =====

export async function getAllBanks() {
  return db.select().from(banks).orderBy(asc(banks.name));
}

export async function getBankBySlug(slug: string) {
  const [bank] = await db.select().from(banks).where(eq(banks.slug, slug)).limit(1);
  return bank;
}

export async function getBankBranchStats(bankId: number) {
  const [openBranches] = await db
    .select({ count: sql<number>`count(*)` })
    .from(branches)
    .where(and(eq(branches.bankId, bankId), eq(branches.type, "branch"), eq(branches.status, "open")));
  const [closedBranches] = await db
    .select({ count: sql<number>`count(*)` })
    .from(branches)
    .where(and(eq(branches.bankId, bankId), eq(branches.type, "branch"), eq(branches.status, "closed")));
  const [atmCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(branches)
    .where(and(eq(branches.bankId, bankId), eq(branches.type, "atm"), eq(branches.status, "open")));
  return {
    openBranches: openBranches.count,
    closedBranches: closedBranches.count,
    atms: atmCount.count,
  };
}

export async function getBankStatesPresence(bankId: number) {
  return db
    .select({
      stateSlug: suburbs.stateSlug,
      state: suburbs.state,
      branchCount: sql<number>`count(DISTINCT CASE WHEN ${branches.type} = 'branch' AND ${branches.status} = 'open' THEN ${branches.id} END)`,
      atmCount: sql<number>`count(DISTINCT CASE WHEN ${branches.type} = 'atm' AND ${branches.status} = 'open' THEN ${branches.id} END)`,
      closedCount: sql<number>`count(DISTINCT CASE WHEN ${branches.status} = 'closed' THEN ${branches.id} END)`,
    })
    .from(branches)
    .innerJoin(suburbs, eq(branches.suburbId, suburbs.id))
    .where(eq(branches.bankId, bankId))
    .groupBy(suburbs.stateSlug, suburbs.state)
    .orderBy(asc(suburbs.state));
}

export async function getBankSuburbsInState(bankId: number, stateSlug: string) {
  return db
    .select({
      suburbName: suburbs.name,
      suburbSlug: suburbs.slug,
      postcode: suburbs.postcode,
      stateSlug: suburbs.stateSlug,
      branchCount: sql<number>`count(DISTINCT CASE WHEN ${branches.type} = 'branch' AND ${branches.status} = 'open' THEN ${branches.id} END)`,
      atmCount: sql<number>`count(DISTINCT CASE WHEN ${branches.type} = 'atm' AND ${branches.status} = 'open' THEN ${branches.id} END)`,
      closedCount: sql<number>`count(DISTINCT CASE WHEN ${branches.status} = 'closed' THEN ${branches.id} END)`,
    })
    .from(branches)
    .innerJoin(suburbs, eq(branches.suburbId, suburbs.id))
    .where(and(eq(branches.bankId, bankId), eq(suburbs.stateSlug, stateSlug)))
    .groupBy(suburbs.name, suburbs.slug, suburbs.postcode, suburbs.stateSlug)
    .orderBy(asc(suburbs.name));
}

export async function getBankBranchesInSuburb(bankId: number, suburbSlug: string) {
  return db
    .select({
      id: branches.id,
      name: branches.name,
      address: branches.address,
      lat: branches.lat,
      lng: branches.lng,
      type: branches.type,
      status: branches.status,
      bsb: branches.bsb,
      openingHours: branches.openingHours,
      closedDate: branches.closedDate,
      distanceKm: branches.distanceKm,
      feeRating: branches.feeRating,
      suburbName: suburbs.name,
      postcode: suburbs.postcode,
      state: suburbs.state,
      stateSlug: suburbs.stateSlug,
    })
    .from(branches)
    .innerJoin(suburbs, eq(branches.suburbId, suburbs.id))
    .where(and(eq(branches.bankId, bankId), eq(suburbs.slug, suburbSlug)))
    .orderBy(asc(branches.type), asc(branches.name));
}

// ===== ATM PAGE DATA =====

export async function getAtmsForSuburb(suburbSlug: string) {
  return db
    .select({
      id: branches.id,
      name: branches.name,
      address: branches.address,
      lat: branches.lat,
      lng: branches.lng,
      status: branches.status,
      feeRating: branches.feeRating,
      bankName: banks.name,
      bankSlug: banks.slug,
      suburbName: suburbs.name,
      postcode: suburbs.postcode,
      state: suburbs.state,
      stateSlug: suburbs.stateSlug,
    })
    .from(branches)
    .innerJoin(banks, eq(branches.bankId, banks.id))
    .innerJoin(suburbs, eq(branches.suburbId, suburbs.id))
    .where(and(eq(suburbs.slug, suburbSlug), eq(branches.type, "atm")))
    .orderBy(asc(banks.name));
}

// ===== COMPARISON DATA =====

export async function getBankComparisonData(bankSlug: string) {
  const bank = await getBankBySlug(bankSlug);
  if (!bank) return null;
  const stats = await getBankBranchStats(bank.id);
  const statePresence = await getBankStatesPresence(bank.id);
  return { bank, stats, stateCount: statePresence.length };
}

// ===== ALL BANK-STATE COMBOS =====

export async function getAllBankStateCombos() {
  return db
    .select({
      bankSlug: banks.slug,
      stateSlug: suburbs.stateSlug,
    })
    .from(branches)
    .innerJoin(banks, eq(branches.bankId, banks.id))
    .innerJoin(suburbs, eq(branches.suburbId, suburbs.id))
    .groupBy(banks.slug, suburbs.stateSlug);
}

// ===== ALL BANK-STATE-SUBURB COMBOS =====

export async function getAllBankStateSuburbCombos() {
  return db
    .select({
      bankSlug: banks.slug,
      stateSlug: suburbs.stateSlug,
      suburbSlug: suburbs.slug,
    })
    .from(branches)
    .innerJoin(banks, eq(branches.bankId, banks.id))
    .innerJoin(suburbs, eq(branches.suburbId, suburbs.id))
    .groupBy(banks.slug, suburbs.stateSlug, suburbs.slug);
}
