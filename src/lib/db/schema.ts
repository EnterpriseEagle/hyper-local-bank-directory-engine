import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const suburbs = sqliteTable("suburbs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  postcode: text("postcode").notNull(),
  state: text("state").notNull(),
  stateSlug: text("state_slug").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  branchCount: integer("branch_count").notNull().default(0),
  atmCount: integer("atm_count").notNull().default(0),
  closedBranches: integer("closed_branches").notNull().default(0),
  closedAtms: integer("closed_atms").notNull().default(0),
  population: integer("population").default(0),
});

export const banks = sqliteTable("banks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  type: text("type").notNull(), // "big4" | "regional" | "digital" | "credit_union"
  logoUrl: text("logo_url"),
  website: text("website"),
});

export const branches = sqliteTable("branches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bankId: integer("bank_id").notNull().references(() => banks.id),
  suburbId: integer("suburb_id").notNull().references(() => suburbs.id),
  name: text("name").notNull(),
  address: text("address").notNull(),
  postcode: text("postcode").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  type: text("type").notNull(), // "branch" | "atm"
  status: text("status").notNull(), // "open" | "closed" | "limited"
  bsb: text("bsb"),
  openingHours: text("opening_hours"), // JSON string
  closedDate: text("closed_date"),
  distanceKm: real("distance_km"),
  feeRating: text("fee_rating"), // "none" | "low" | "medium" | "high"
});
