# VideoGenerator - Architecture Plan

**Version:** 1.0.0  
**Date:** 2026-02-02  
**Product:** AI-powered video creation platform for modern storytellers

---

## Executive Summary

VideoGenerator is a web application combining a marketing landing page with an authenticated workspace. Users can create AI-generated videos from text prompts, manage their video library, reuse templates, and track usage analytics.

**Core Value Proposition:** Fast prompt-to-video creation with curated styles, reusable templates, and an organized content library.

**Key Deliverables:**
- Marketing landing page (index)
- Authenticated app with Dashboard, My Videos, Templates, Usage, and Account pages
- Global navigation and auth popups shared across all pages
- Reusable UI component library
- Clear data models and API contracts

---

## Scope

### Pages
| Type | Pages |
|------|-------|
| Marketing | Index (landing page) |
| Authenticated | Dashboard, My Videos, Templates, Usage, Account |

### Shared Components
- Top Navigation Bar
- Mobile Slide-in Menu
- Auth Popups (Login / Sign Up)

### Data Models
- **User** - id, email, displayName, avatar, preferences
- **Video** - id, title, prompt, styleId, aspectRatio, duration, status, timestamps, fileUrl, templateId
- **Template** - id, title, basePrompt, defaultStyle, defaultAspectRatio, defaultDuration
- **Style** - id, name, colorToken

### Status Values
`Queued` | `Processing` | `Completed` | `Failed`

---

## Architecture Blueprint

### Global Shell Layout

```
┌─────────────────────────────────────────┐
│              TopNav                      │
│  Brand | Home | Dashboard | ... | Auth  │
├─────────────────────────────────────────┤
│                                         │
│            Page Content                  │
│    (Index / Dashboard / My Videos ...)   │
│                                         │
├─────────────────────────────────────────┤
│         Auth Modals (Overlay)            │
│    Login | Sign Up (toggleable)          │
└─────────────────────────────────────────┘
```

### Page-by-Page Structure

#### 1. Index (Marketing)
Vertical stack of sections:
1. **Hero** - Headline, CTAs, Sample Video Panel
2. **Steps Section** - 3-step workflow
3. **Feature Tiles** - 4 feature cards
4. **Example Videos** - Sample card grid
5. **Workflow Section** - Pipeline explanation
6. **Testimonial** - User quote
7. **Snapshot** - Usage stats grid
8. **FAQ Accordion** - Q&A with expand/collapse
9. **Final CTA** - Sign up / Log in

#### 2. Dashboard
```
┌─────────────────────────────────────────┐
│ Page Header: Dashboard                   │
│ Subtitle: Create videos, track progress  │
├─────────────────────────────────────────┤
│ Create New Video Panel                   │
│ [Title] [Prompt] [Style] [Ratio] [Duration] │
│ [Generate Video Button]                  │
├─────────────────────────────────────────┤
│ Recent Videos       │  Usage Overview    │
│ [List with status]  │  [Stats Grid]      │
├─────────────────────────────────────────┤
│ Quick Templates                          │
│ [Template Cards with Use button]         │
└─────────────────────────────────────────┘
```

#### 3. My Videos
```
┌─────────────────────────────────────────┐
│ Page Header: My Videos                   │
│ Subtitle: Manage all AI-generated videos │
├─────────────────────────────────────────┤
│ Filters Bar                              │
│ [Status] [Sort By] [Apply]               │
├─────────────────────────────────────────┤
│ Video List                               │
│ [Row per video: Title | Status | Actions]│
├─────────────────────────────────────────┤
│ Overlays (on demand)                     │
│ - Video Details Modal                    │
│ - Duplicate & Edit Modal                 │
│ - Delete Confirmation Modal              │
└─────────────────────────────────────────┘
```

#### 4. Templates
```
┌─────────────────────────────────────────┐
│ Page Header: Prompt Templates            │
│ Subtitle: Reusable prompt templates      │
├─────────────────────────────────────────┤
│ Top Controls                             │
│ [New Template] [Search] [Filter] [Apply] │
├─────────────────────────────────────────┤
│ Templates List                           │
│ [Card per template: Title | Defaults | Actions] │
├─────────────────────────────────────────┤
│ Overlays                                 │
│ - Create/Edit Template Modal             │
│ - Delete Confirmation                    │
│ - Create Video from Template             │
└─────────────────────────────────────────┘
```

#### 5. Usage
```
┌─────────────────────────────────────────┐
│ Page Header: Usage Overview              │
│ Subtitle: Track video generation activity│
├─────────────────────────────────────────┤
│ Summary Statistics                       │
│ [Total] [Queued] [Processing] [Completed]│
├─────────────────────────────────────────┤
│ Recent Activity                          │
│ [7 Days] [30 Days] [With Files]          │
├─────────────────────────────────────────┤
│ Usage Breakdowns                         │
│ By Style  │  By Aspect Ratio             │
├─────────────────────────────────────────┤
│ Quick Actions                            │
│ [My Videos] [Templates] [Create Video]   │
└─────────────────────────────────────────┘
```

#### 6. Account
```
┌─────────────────────────────────────────┐
│ Page Header: Account Settings            │
│ Subtitle: Manage profile & preferences   │
├─────────────────────────────────────────┤
│ Profile Section                          │
│ [Email (read-only)] [Display Name]       │
├─────────────────────────────────────────┤
│ Security Section                         │
│ [Password guidance] [Change Password]    │
├─────────────────────────────────────────┤
│ Your Data Section                        │
│ [Stored data description]                │
├─────────────────────────────────────────┤
│ Danger Zone                              │
│ [Delete Account button]                  │
├─────────────────────────────────────────┤
│ Quick Links                              │
│ [My Videos] [Templates] [Usage]          │
└─────────────────────────────────────────┘
```

---

## Component Map

### Global Shell Components
| Component | Props | Children |
|-----------|-------|----------|
| `TopNav` | links, brand, activeLink, onLogin, onSignUp, onLogOut | - |
| `MobileMenu` | isOpen, onClose, links | - |
| `AuthModalContainer` | isOpen, onClose, toggleToOtherModal | LoginModal, SignUpModal |
| `PageShell` | children, pageTitle | - |

### Page Components (Key)

**Index:** HeroSection, SampleVideoPanel, StepsSection, FeatureTiles, ExampleVideosSection, WorkflowSection, TestimonialSection, SnapshotSection, FAQAccordion, FinalCTA

**Dashboard:** CreateVideoPanel, RecentVideos, UsageOverview, QuickTemplates, VideoDetailsModal, CreateFromTemplateModal

**My Videos:** FiltersBar, VideoList, VideoDetailsModal, DuplicateAndEditModal, DeleteVideoModal

**Templates:** TopControlsBar, TemplatesList, CreateTemplateModal, EditTemplateModal, DeleteTemplateModal, CreateVideoFromTemplateModal

**Usage:** SummaryStatistics, RecentActivity, UsageBreakdowns, QuickActions

**Account:** ProfileSection, SecuritySection, YourDataSection, DangerZone, QuickLinks, ChangePasswordModal, DeleteAccountModal

---

## Route Map

| Path | Page | Layout |
|------|------|--------|
| `/` | index | PageShell |
| `/dashboard` | dashboard | PageShell |
| `/my-videos` | myVideos | PageShell |
| `/templates` | templates | PageShell |
| `/usage` | usage | PageShell |
| `/account` | account | PageShell |

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + Design Tokens
- **State:** React Context + Hooks
- **Routing:** Next.js App Router

---

## Implementation Phases

| Phase | Name | Duration | Outputs |
|-------|------|----------|---------|
| P1 | Scoping & Blueprint | 2 days | Route Map, Component Map, Data Contracts |
| P2 | Shell & Routing | 3 days | TopNav, MobileMenu, AuthModals, PageShell |
| P3 | UI Baukasten | 4 days | Card, Button, Input, Select, Badge, Modal, Grid, Tokens |
| P4 | Data Models & Mock APIs | 2 days | TS Interfaces, Mock Hooks, API Contracts |
| P5 | MVP Layouts | 12 days | All 6 pages with basic UI |
| P6 | Polish & Accessibility | 3 days | Keyboard nav, ARIA, focus management |
| P7 | Export & Documentation | 1 day | PLAN.JSON, PLAN.PDF, README |

---

## High-Impact Tasks (Priority Order)

1. **HIT1:** Global Shell Blueprint (TopNav + MobileMenu + AuthModalContainer)
2. **HIT2:** Route Map & Layout Skeletons
3. **HIT3:** UI Component Library (Card, Button, Input, Select, Badge, Modal, Grid + Tokens)
4. **HIT4:** Data Models & API Contracts
5. **HIT5:** Index Page MVP (full vertical flow)
6. **HIT6:** Dashboard MVP (create panel + lists + overlays)
7. **HIT7:** My Videos MVP (filter bar + CRUD modals)
8. **HIT8:** Templates MVP (CRUD + create video from template)
9. **HIT9:** Usage MVP (stats + breakdowns + actions)
10. **HIT10:** Account MVP (profile + security + danger zone)

---

## Accessibility Requirements

- **Standard:** WCAG 2.1 AA
- **Keyboard Navigation:** All interactive elements reachable via keyboard
- **Focus Management:** Visible focus rings, logical tab order
- **ARIA Labels:** Proper labeling for screen readers
- **Modals:** Focus trap, Escape to close, click outside to close

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Unclear tech stack | Quick decision session with lead architect in P1 |
| Overcomplex UI architecture | Focus on global shell + component library; prioritize MVP |
| Insufficient data contracts | Define interfaces + mock APIs in P4 |
| Accessibility failures | A11y checklists from P2, regular checks |

---

## Success Metrics (KPIs)

- ✅ All pages render within global shell
- ✅ Auth modals accessible from any route
- ✅ 100% reusable UI component library
- ✅ Mock APIs ready for data integration
- ✅ Zero accessibility violations (WCAG 2.1 AA)

---

## Export Formats

- **Machine-Readable:** `PLAN.JSON` - complete plan data for tooling
- **Human-Readable:** `PLAN.md` - convertible to PDF for stakeholders

---

*Plan generated: 2026-02-02*
*Next: Begin Phase 1 - Scoping & Blueprint*
