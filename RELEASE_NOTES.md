Release v0.3.0 — End-to-End Flows A-F, PDF Export, Accessibility & CI

Overview
- This release delivers a robust end-to-end test harness across Flow A-F, a production-grade PDF export path, and a hardened accessibility story. It establishes CI coverage so your newsletter audience can trust the ship-ready code.

Key Highlights
- End-to-End Flows A-F: Flow A (CSV), Flow B (PDF), Flow C (A+B), Flow D (stress), Flow E (A+B full end-to-end), Flow F (health-check)
- PDF export: Production-grade with pdf-lib; multi-page, styled output for storyboard exports
- CSV export: Stable data export of storyboard scenes
- Pack export: JSON export of videos/templates
- Accessibility: Focus order checks, ARIA live announcements, keyboard scrubbing
- Playback-rate tests: Initialization, updates, and remount persistence
- CI: GitHub Actions workflow; unit tests + end-to-end matrix for A-F

Quick Start (dev environment)
- Install: npm install
- Run app: npm run dev
- Unit tests: npm test
- End-to-end: npm run test:e2e (flows A-F) - or target: npx playwright test e2e/flow-*.spec.ts

What’s Included in this Release
- Flow A–F (A: CSV; B: PDF; C: A+B; D: Stress; E: Combined; F: Health-check)
- PDF export with pdf-lib; CSV export; JSON Pack export
- Accessibility and playback-rate hardening
- New test suite scaffolding and CI workflow

Upgrade Notes
- Minor version bump to 0.3.0. No breaking changes expected; tests rely on stable selectors and data attributes. If you customize UI text, update selectors accordingly.

Known Issues
- No known critical issues; minor flaky tests may appear in CI on fresh environments and will be retried by the workflow.

Credits
- Built with OpenCode agents; big thanks to the automation and CI scaffolding for ensuring repeatable quality.
