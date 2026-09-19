export const projectSlugs = [
  "portfolio",
  "optigen",
  "mcp",
  "voice-gateway",
  "kepco",
  "wchms",
  "flare",
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];
export type PortfolioAssetPath = `/${string}`;
export type PortfolioExternalUrl = string;

export function isProjectSlug(value: string): value is ProjectSlug {
  return projectSlugs.some((slug) => slug === value);
}
