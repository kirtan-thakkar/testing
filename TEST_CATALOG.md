# IdeaKicks Test Catalog

**32 spec files · 120 active tests**

Re-generate with: `node tests/build-catalog.js`

## Index

- **AUTH & Account** — 6 test groups, 6 tests
- **Campaign Creation & Details** — 7 test groups, 7 tests
- **Wizard (Application)** — 22 test groups, 22 tests
- **Admin Panel** — 19 test groups, 40 tests
- **Performance / Stress / Load** — 10 test groups, 10 tests

---

## AUTH & Account

### UF-ACCT-01 (1 test)

- UF-ACCT-01: Update Profile Bio  `tests\account.spec.js`

### UF-ACCT-02 (1 test)

- UF-ACCT-02: Change Account Password  `tests\account.spec.js`

### UF-AUTH-01 (1 test)

- UF-AUTH-01: User Registration Page Loads  `tests\auth.spec.js`

### UF-AUTH-02 (1 test)

- UF-AUTH-02: Login - Invalid Credentials (Negative Path)  `tests\auth.spec.js`

### UF-AUTH-03 (1 test)

- UF-AUTH-03: Login - Success (Positive Path)  `tests\auth.spec.js`

### UF-DASH-01 (1 test)

- UF-DASH-01: Creator Dashboard Tabs Navigation  `tests\dashboard.spec.js`

## Campaign Creation & Details

### UF-BACK-01 (1 test)

- UF-BACK-01: Reward & Add-on Selection  `tests\checkout.spec.js`

### UF-BACK-02 (1 test)

- UF-BACK-02: Payment Terms Validation (Negative Path)  `tests\checkout.spec.js`

### UF-BACK-03 (1 test)

- UF-BACK-03: Complete Pledge (Positive Path)  `tests\checkout.spec.js`

### UF-CAMP-01 (1 test)

- UF-CAMP-01: Campaign Detail Tabs Navigation  `tests\campaign-details.spec.js`

### UF-CAMP-02 (1 test)

- UF-CAMP-02: Save Campaign & Dashboard Sync  `tests\campaign-details.spec.js`

### UF-CREA-01 (1 test)

- UF-CREA-01: Campaign Application Page Loads  `tests\campaign-creation.spec.js`

### UF-CREA-02 (1 test)

- UF-CREA-02: Campaign Application - Navigate to Application  `tests\campaign-creation.spec.js`

## Wizard (Application)

### UF-WIZ-01 (1 test)

- UF-WIZ-01-P: Wizard page renders step 1 with all required fields  `tests\wizard-application.positive.spec.js`

### UF-WIZ-02 (1 test)

- UF-WIZ-02-P: Continue is enabled when all required fields are filled  `tests\wizard-application.positive.spec.js`

### UF-WIZ-03 (1 test)

- UF-WIZ-03-P: PAN field shows correct placeholder  `tests\wizard-application.positive.spec.js`

### UF-WIZ-04 (1 test)

- UF-WIZ-04-P: Step 1 happy path advances to step 2  `tests\wizard-application.positive.spec.js`

### UF-WIZ-05 (1 test)

- UF-WIZ-05-N: 5000-char paste in company name does not crash  `tests\wizard-application.negative.spec.js`

### UF-WIZ-06 (1 test)

- UF-WIZ-06-N: XSS / SQL-injection payload in company name does not break  `tests\wizard-application.negative.spec.js`

### UF-WIZ-07 (1 test)

- UF-WIZ-07-P: Step 2 Build Page is reachable and has file inputs  `tests\wizard-application.positive.spec.js`

### UF-WIZ-08 (1 test)

- UF-WIZ-08-P: Step 1 page loads cleanly with no JS errors  `tests\wizard-application.positive.spec.js`

### UF-WIZ-09 (1 test)

- UF-WIZ-09-N: Form advances even with unchecked eligibility (BUG)  `tests\wizard-application.negative.spec.js`

### UF-WIZ-10 (1 test)

- UF-WIZ-10-P: Country dropdown lists India  `tests\wizard-application.positive.spec.js`

### UF-WIZ-11 (1 test)

- UF-WIZ-11-P: Subcategory populates after category chosen  `tests\wizard-application.positive.spec.js`

### UF-WIZ-12 (1 test)

- UF-WIZ-12-N: Lowercase PAN does not crash the form  `tests\wizard-application.negative.spec.js`

### UF-WIZ-13 (1 test)

- UF-WIZ-13-N: Whitespace-only company name does not advance  `tests\wizard-application.negative.spec.js`

### UF-WIZ-14 (1 test)

- UF-WIZ-14-P: GSTIN optional field accepts valid value  `tests\wizard-application.positive.spec.js`

### UF-WIZ-15 (1 test)

- UF-WIZ-15-N: Page reload after partial fill — form behaviour documented  `tests\wizard-application.negative.spec.js`

### UF-WIZ-16 (1 test)

- UF-WIZ-16-N: Browser back from step 2 lands on step 1 (or stays step 2 without crash)  `tests\wizard-application.negative.spec.js`

### UF-WIZ-17 (1 test)

- UF-WIZ-17-N: Step 2 has at least one media upload control  `tests\wizard-application.negative.spec.js`

### UF-WIZ-18 (1 test)

- UF-WIZ-18-N: Step 3 review reflects company name from step 1  `tests\wizard-application.negative.spec.js`

### UF-WIZ-19 (1 test)

- UF-WIZ-19-N: First Tab reaches a focusable element  `tests\wizard-application.negative.spec.js`

### UF-WIZ-20 (1 test)

- UF-WIZ-20-P: Wizard URL is exactly /start/application  `tests\wizard-application.positive.spec.js`

### UF-WIZ-21 (1 test)

- UF-WIZ-21-N: Unauthenticated wizard access is gated  `tests\wizard-application.negative.spec.js`

### UF-WIZ-22 (1 test)

- UF-WIZ-22-N: Double-click Continue does not skip a step  `tests\wizard-application.negative.spec.js`

## Admin Panel

### UF-ADMIN-01 (4 tests)

- UF-ADMIN-01-N: Empty search returns empty state, not error  `tests\admin-campaigns.negative.spec.js`
- UF-ADMIN-01-N2: 5000-char search does not crash search  `tests\admin-campaigns.negative.spec.js`
- UF-ADMIN-01-P: Project Submissions page loads with heading  `tests\admin-campaigns.positive.spec.js`
- UF-ADMIN-01: Admin View Project Submissions  `tests\admin-campaigns.spec.js`

### UF-ADMIN-02 (2 tests)

- UF-ADMIN-02-P: Project Submissions filter UI is present  `tests\admin-campaigns.positive.spec.js`
- UF-ADMIN-02: Admin Filter Project Submissions  `tests\admin-campaigns.spec.js`

### UF-ADMIN-03 (3 tests)

- UF-ADMIN-03-N: Special characters in campaign search do not crash  `tests\admin-campaigns.negative.spec.js`
- UF-ADMIN-03-P: Campaigns list page loads  `tests\admin-campaigns.positive.spec.js`
- UF-ADMIN-03: Admin Search & Filter Campaigns  `tests\admin-campaigns.spec.js`

### UF-ADMIN-04 (2 tests)

- UF-ADMIN-04-P: Categories page loads  `tests\admin-campaigns.positive.spec.js`
- UF-ADMIN-04: Admin Categories Page  `tests\admin-campaigns.spec.js`

### UF-ADMIN-05 (2 tests)

- UF-ADMIN-05-P: Country Fields (Application Fields) page loads  `tests\admin-campaigns.positive.spec.js`
- UF-ADMIN-05: Admin Application Fields Page  `tests\admin-campaigns.spec.js`

### UF-ADMIN-06 (2 tests)

- UF-ADMIN-06-P: Partners page loads  `tests\admin-campaigns.positive.spec.js`
- UF-ADMIN-06: Admin View Partners Tab  `tests\admin-campaigns.spec.js`

### UF-ADMIN-07 (2 tests)

- UF-ADMIN-07-P: Payouts page loads  `tests\admin-finance.positive.spec.js`
- UF-ADMIN-07: Admin View Payouts  `tests\admin-finance.spec.js`

### UF-ADMIN-08 (2 tests)

- UF-ADMIN-08-P: Pledges page loads  `tests\admin-finance.positive.spec.js`
- UF-ADMIN-08: Admin Manage Pledges  `tests\admin-finance.spec.js`

### UF-ADMIN-09 (2 tests)

- UF-ADMIN-09-P: Refunds log page loads  `tests\admin-finance.positive.spec.js`
- UF-ADMIN-09: Admin View Refunds Log  `tests\admin-finance.spec.js`

### UF-ADMIN-10 (2 tests)

- UF-ADMIN-10-P: User Management page loads with   `tests\admin-people.positive.spec.js`
- UF-ADMIN-10: Admin User Management  `tests\admin-people.spec.js`

### UF-ADMIN-11 (2 tests)

- UF-ADMIN-11-P: Roles page loads with   `tests\admin-people.positive.spec.js`
- UF-ADMIN-11: Admin Manage Roles  `tests\admin-people.spec.js`

### UF-ADMIN-12 (2 tests)

- UF-ADMIN-12-P: Deletion Requests page loads  `tests\admin-people.positive.spec.js`
- UF-ADMIN-12: Admin Review Deletion Requests  `tests\admin-people.spec.js`

### UF-ADMIN-13 (2 tests)

- UF-ADMIN-13-P: Contact Inbox page loads  `tests\admin-engagement.positive.spec.js`
- UF-ADMIN-13: Admin Manage Contact Inbox  `tests\admin-engagement.spec.js`

### UF-ADMIN-14 (2 tests)

- UF-ADMIN-14-P: Subscribers page loads  `tests\admin-engagement.positive.spec.js`
- UF-ADMIN-14: Admin View Subscribers  `tests\admin-engagement.spec.js`

### UF-ADMIN-15 (2 tests)

- UF-ADMIN-15-P: CMS Pages list loads with heading  `tests\admin-content.positive.spec.js`
- UF-ADMIN-15: Admin Manage CMS Pages  `tests\admin-content.spec.js`

### UF-ADMIN-16 (2 tests)

- UF-ADMIN-16-P: CMS settings page loads  `tests\admin-content.positive.spec.js`
- UF-ADMIN-16: Admin Configure Global CMS Content  `tests\admin-content.spec.js`

### UF-ADMIN-17 (2 tests)

- UF-ADMIN-17-P: Notifications page loads  `tests\admin-system.positive.spec.js`
- UF-ADMIN-17: Admin View Notifications  `tests\admin-system.spec.js`

### UF-ADMIN-18 (2 tests)

- UF-ADMIN-18-P: Activity log page loads  `tests\admin-system.positive.spec.js`
- UF-ADMIN-18: Admin View Activity Log  `tests\admin-system.spec.js`

### UF-ADMIN-99 (1 test)

- UF-ADMIN-99-N: Direct visit to admin without auth redirects to /login  `tests\admin-campaigns.negative.spec.js`

## Performance / Stress / Load

### UF-LOAD-01 (1 test)

- UF-LOAD-01: Login endpoint survives concurrent invalid requests  `tests\login-load.spec.js`

### UF-LOAD-02 (1 test)

- UF-LOAD-02: Login endpoint survives burst of 50 requests in 1s  `tests\login-load.spec.js`

### UF-PERF-01 (1 test)

- UF-PERF-01: Homepage loads in under 5s (warm)  `tests\performance.spec.js`

### UF-PERF-02 (1 test)

- UF-PERF-02: /explore (discover) loads in under 8s (warm)  `tests\performance.spec.js`

### UF-PERF-03 (1 test)

- UF-PERF-03: /login loads in under 5s  `tests\performance.spec.js`

### UF-PERF-04 (1 test)

- UF-PERF-04: /start/application wizard loads in under 8s  `tests\performance.spec.js`

### UF-PERF-05 (1 test)

- UF-PERF-05: /explore responds to search query within 5s  `tests\performance.spec.js`

### UF-PERF-06 (1 test)

- UF-PERF-06: Homepage HTML payload is under 200KB  `tests\performance.spec.js`

### UF-STRESS-01 (1 test)

- UF-STRESS-01: 5 parallel page loads all complete within 30s  `tests\performance.spec.js`

### UF-STRESS-02 (1 test)

- UF-STRESS-02: 10 parallel /login navigations do not crash the server  `tests\performance.spec.js`

---

## Summary by Spec File

| Spec file | Describe | Tests |
|-----------|----------|-------|
| `tests\account.spec.js` | 3. Account Management Flows | 2 |
| `tests\admin-campaigns.negative.spec.js` | (no describe) | 4 |
| `tests\admin-campaigns.positive.spec.js` | (no describe) | 6 |
| `tests\admin-campaigns.spec.js` | (no describe) | 6 |
| `tests\admin-content.negative.spec.js` | (no describe) | 2 |
| `tests\admin-content.positive.spec.js` | (no describe) | 2 |
| `tests\admin-content.spec.js` | (no describe) | 2 |
| `tests\admin-engagement.negative.spec.js` | (no describe) | 3 |
| `tests\admin-engagement.positive.spec.js` | (no describe) | 2 |
| `tests\admin-engagement.spec.js` | (no describe) | 2 |
| `tests\admin-finance.negative.spec.js` | (no describe) | 3 |
| `tests\admin-finance.positive.spec.js` | (no describe) | 3 |
| `tests\admin-finance.spec.js` | (no describe) | 3 |
| `tests\admin-people.negative.spec.js` | (no describe) | 4 |
| `tests\admin-people.positive.spec.js` | (no describe) | 3 |
| `tests\admin-people.spec.js` | (no describe) | 3 |
| `tests\admin-system.negative.spec.js` | (no describe) | 3 |
| `tests\admin-system.positive.spec.js` | (no describe) | 2 |
| `tests\admin-system.spec.js` | (no describe) | 2 |
| `tests\auth.spec.js` | 1. Authentication & Registration Flows | 3 |
| `tests\campaign-creation.spec.js` | 2. Campaign Creation (Creator Wizard) Flows | 2 |
| `tests\campaign-details.spec.js` | 5. Campaign Details Flows | 2 |
| `tests\checkout.spec.js` | 6. Checkout & Pledging Flows | 3 |
| `tests\dashboard.spec.js` | Dashboard specific flows | 1 |
| `tests\discover.spec.js` | 4. Discovery & Search Flows | 3 |
| `tests\info-and-legal.spec.js` | 7. Informational & Legal Flows | 4 |
| `tests\login-load.spec.js` | (no describe) | 2 |
| `tests\performance.spec.js` | Performance & Stress — IdeaKicks | 8 |
| `tests\wizard-application.negative.spec.js` | 8. Campaign Application Wizard — NEGATIVE / EDGE flows | 12 |
| `tests\wizard-application.positive.spec.js` | 8. Campaign Application Wizard — POSITIVE flows | 10 |
| `tests\wizard-step2-uploads.negative.spec.js` | Wizard Step 2 — Media uploads (NEGATIVE / EDGE) | 8 |
| `tests\wizard-step2-uploads.positive.spec.js` | Wizard Step 2 — Media uploads (POSITIVE) | 5 |