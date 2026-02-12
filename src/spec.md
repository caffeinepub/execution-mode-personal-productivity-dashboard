# Specification

## Summary
**Goal:** Ensure the dashboard shows its intended desktop multi-column layout on large screens and make the DailyQuote automatically refresh when the calendar day changes, without redesigning anything.

**Planned changes:**
- Fix dashboard responsive behavior so `lg:*` grid classes apply correctly on desktop widths (≥ 1024px) while preserving the current mobile single-column layout.
- Update DailyQuote refresh logic to detect calendar day changes (including when the tab stays open past midnight) and fetch/activate a new quote for the new day while keeping the existing localStorage caching keys/behavior and UI unchanged.

**User-visible outcome:** On desktop, the dashboard displays in the intended multi-column layout; the daily quote updates automatically each new day even if the page remains open, while staying the same throughout a given day.
