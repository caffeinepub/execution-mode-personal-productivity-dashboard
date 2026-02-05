# Specification

## Summary
**Goal:** Add an in-app theme mode switcher (Light/Dark/System Default) accessed via a subtle settings icon in the Dashboard header, without changing the existing dashboard layout or visuals.

**Planned changes:**
- Add a small, low-visual-weight gear/settings icon control to the top-right of the existing Dashboard header, keeping all current header elements in the exact same positions and styling.
- Open a clean, minimal modal when the icon is clicked that contains only three theme mode options: Light, Dark, and System Default (recommended default selection).
- Implement instant theme switching (no reload, no layout shift) using the app’s existing theming approach, with local persistence (e.g., localStorage) so manual selection overrides system preference and System Default follows OS/device settings.
- Ensure the new icon and modal remain accessible (keyboard focus, accessible name) and readable/contrast-safe in both Light and Dark themes, without altering existing dashboard component visuals.

**User-visible outcome:** Users can click a subtle settings icon in the Dashboard header to choose Light, Dark, or System Default theme mode, with the preference applied immediately and remembered across sessions.
