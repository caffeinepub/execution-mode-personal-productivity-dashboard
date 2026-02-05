/**
 * Shared color palette for study activity visualization
 * Ensures consistent coloring across heatmap and progress chart
 */

export const STUDY_COLORS = {
  // Activity indicators (theme-independent)
  moderate: 'oklch(0.65 0.15 50)', // Orange for 0 < hours < 3
  high: 'oklch(0.65 0.18 145)',     // Green for hours >= 3
  muted: 'oklch(0.30 0.02 240)',    // Muted for 0 hours in charts
} as const;

/**
 * Get activity level based on hours studied
 */
export function getActivityLevel(hours: number): 'none' | 'moderate' | 'high' {
  if (hours === 0) return 'none';
  if (hours < 3) return 'moderate';
  return 'high';
}

/**
 * Get color for activity level
 */
export function getActivityColor(hours: number): string {
  const level = getActivityLevel(hours);
  
  if (level === 'none') return STUDY_COLORS.muted;
  if (level === 'moderate') return STUDY_COLORS.moderate;
  return STUDY_COLORS.high;
}
