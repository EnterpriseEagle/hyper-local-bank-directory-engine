import { db } from "./db";
import { suburbs, branches, banks, statusReports } from "./db/schema";
import { eq, sql, and, desc, asc, ne } from "drizzle-orm";

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
