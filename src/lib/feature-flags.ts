function isDisabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "false";
}

// Affiliate and status features are ON by default — set env to "false" to disable
export const affiliateFeaturesEnabled = !isDisabled(
  process.env.NEXT_PUBLIC_ENABLE_AFFILIATE_FEATURES
);

export const statusReportsEnabled = !isDisabled(
  process.env.NEXT_PUBLIC_ENABLE_STATUS_REPORTS
);
