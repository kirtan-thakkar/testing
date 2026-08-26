# Comprehensive ideakicks User Flows (Positive & Negative Paths)

This document is the master inventory of all UI/UX flows mapped on the ideakicks platform, combining both happy paths (positive) and edge cases/validation failures (negative). 

---

## 1. Authentication & Registration Flows

### USER FLOW ID: UF-AUTH-01
**USER FLOW NAME:** User Registration and Verification Status
**ACTOR:** Unauthenticated Visitor
**USER GOAL:** Create a new account and verify status.
**PRECONDITIONS:** User does not have an existing account.
**START STATE:** User is on the Home page (`/`).
**STEPS:**
1. **User action:** Navigates to `/register`.
2. **User action:** Submits name, email, and password.
3. **System response:** Account created; redirects to Dashboard `/dashboard`.
4. **User action:** Clicks "Settings" tab.
5. **System response:** Displays email verification status (e.g., "Unverified").
**FINAL STATE:** User is registered and views unverified status.
**SUCCESS PATH:** Account created successfully.
**ERROR PATH:** Validation blocks registration if email exists.

### USER FLOW ID: UF-AUTH-02
**USER FLOW NAME:** Login - Invalid Credentials (Negative Path)
**ACTOR:** Unauthenticated Visitor
**USER GOAL:** Observe system behavior upon invalid login.
**PRECONDITIONS:** User is on `/login`.
**STEPS:**
1. **User action:** Submits an incorrect email or password.
2. **System response:** UI triggers a red Toast Notification: "Invalid credentials" and keeps the user on the login page.
**FINAL STATE:** Login rejected gracefully.
**ERROR PATH:** System correctly prevents unauthorized access and notifies the user.

### USER FLOW ID: UF-AUTH-03
**USER FLOW NAME:** Login - Success (Positive Path)
**ACTOR:** Unauthenticated Visitor
**USER GOAL:** Log into the platform.
**PRECONDITIONS:** User has valid credentials.
**STEPS:**
1. **User action:** Submits correct email and password.
2. **System response:** System authenticates and redirects to `/dashboard`.
**FINAL STATE:** User is authenticated and viewing their dashboard.
**SUCCESS PATH:** User successfully logs in.

---

## 2. Campaign Creation (Creator Wizard) Flows

### USER FLOW ID: UF-CREA-01
**USER FLOW NAME:** Campaign Application - Step 1 Validation Errors (Negative Path)
**ACTOR:** Authenticated Creator
**USER GOAL:** Verify system enforces mandatory fields on Step 1.
**PRECONDITIONS:** User is on `/start/application` (Step 1).
**STEPS:**
1. **User action:** Clicks "Continue" without filling required fields.
2. **System response:** Client-side validation blocks progression. Red error text highlights missing fields (e.g., Checkboxes, Business Name, PAN).
**FINAL STATE:** User remains on Step 1.
**ERROR PATH:** System enforces requirements.

### USER FLOW ID: UF-CREA-02
**USER FLOW NAME:** Campaign Application - Draft Persistence
**ACTOR:** Authenticated Creator
**USER GOAL:** Ensure progress is saved if the user leaves mid-application.
**PRECONDITIONS:** User has filled out Step 1 and moved to Step 2.
**STEPS:**
1. **User action:** Navigates away from the application entirely (e.g., clicks Home).
2. **System response:** Draft is saved in the backend.
3. **User action:** Returns to `/start/application`.
4. **System response:** System loads previously saved draft data and restores progress.
**FINAL STATE:** User resumes exactly where they left off.
**SUCCESS PATH:** Data persistence functions correctly.

### USER FLOW ID: UF-CREA-03
**USER FLOW NAME:** Campaign Application - Step 2 to Submission (Positive Path)
**ACTOR:** Authenticated Creator
**USER GOAL:** Complete the campaign wizard and submit for review.
**PRECONDITIONS:** User is on Step 2.
**STEPS:**
1. **User action:** Uploads Cover Image, fills Title, Subtitle, Story, and Goal amount. Clicks Continue.
2. **System response:** Proceeds to Step 3 (Review & Submit).
3. **User action:** Clicks "Submit for Review".
4. **System response:** Routes to Step 4 (Success page). Displays "SUBMISSION RECEIVED" and assigns an "UNDER REVIEW" badge.
**FINAL STATE:** Campaign is officially pending Admin approval.
**SUCCESS PATH:** Flawless end-to-end campaign submission.

---

## 3. Account Management Flows

### USER FLOW ID: UF-ACCT-01
**USER FLOW NAME:** Update Profile Bio
**ACTOR:** Authenticated User
**USER GOAL:** Update public profile text.
**PRECONDITIONS:** User is on `/dashboard` -> Settings.
**STEPS:**
1. **User action:** Modifies the "Bio" textarea and clicks "Save Changes".
2. **System response:** Updates backend and displays success state.
**FINAL STATE:** Profile details updated.
**SUCCESS PATH:** Text successfully patched.

### USER FLOW ID: UF-ACCT-02
**USER FLOW NAME:** Change Account Password (Negative & Positive)
**ACTOR:** Authenticated User
**USER GOAL:** Securely change password.
**PRECONDITIONS:** User is on `/dashboard` -> Settings.
**STEPS:**
1. **User action:** Enters a short/invalid password (e.g., "short") and clicks "Set password".
2. **System response:** (NEGATIVE) Validation error: "Password must be at least 10 characters".
3. **User action:** Enters a valid, matching password and submits.
4. **System response:** (POSITIVE) Password successfully updated.
**FINAL STATE:** Security credentials updated.

---

## 4. Discovery & Search Flows

### USER FLOW ID: UF-DISC-01
**USER FLOW NAME:** Global Header Search (Positive Path)
**ACTOR:** Any User
**USER GOAL:** Search for campaigns from the global navigation.
**PRECONDITIONS:** User is on the Home page (`/`).
**STEPS:**
1. **User action:** Clicks "Open search" button in the header.
2. **System response:** Header transforms into an active search input.
3. **User action:** Types query (e.g., `solar`) and presses Enter.
4. **System response:** Navigates to `/explore?q=solar`. Pre-fills the explore search bar, updates campaign count (e.g., "2 campaigns"), and filters the grid.
**FINAL STATE:** User viewing contextual search results.
**SUCCESS PATH:** Global search accurately links to explore page.

### USER FLOW ID: UF-DISC-02
**USER FLOW NAME:** Unsuccessful Campaign Search (Negative Path / Empty State)
**ACTOR:** Any User
**USER GOAL:** Handle zero search results gracefully.
**PRECONDITIONS:** User is on `/explore`.
**STEPS:**
1. **User action:** Types a gibberish query (e.g., `xyz123nonsense`).
2. **System response:** Grid clears. Prominent "No campaigns found" empty state appears.
**FINAL STATE:** Empty state displayed without UI breakage.
**ERROR PATH:** UI handles null results gracefully.

### USER FLOW ID: UF-DISC-03
**USER FLOW NAME:** Explore Category Filtering
**ACTOR:** Any User
**USER GOAL:** Filter campaigns by specific tags.
**PRECONDITIONS:** User is on `/explore`.
**STEPS:**
1. **User action:** Clicks the "Technology" category button in the horizontal scrolling menu.
2. **System response:** Button becomes `[active]`. Results metric updates (e.g., "3 campaigns"). Subtext updates to "Showing Technology". Grid filters immediately without a page reload.
**FINAL STATE:** Campaigns filtered dynamically.
**SUCCESS PATH:** Client-side filtering executes perfectly.

---

## 5. Campaign Details & Dashboard Sync Flows

### USER FLOW ID: UF-CAMP-01
**USER FLOW NAME:** Campaign Detail Tabs Navigation
**ACTOR:** Any User
**USER GOAL:** View granular campaign information.
**PRECONDITIONS:** User navigates to `/campaign/solar`.
**STEPS:**
1. **User action:** Observes secondary navigation.
2. **System response:** Displays functional tabs: Campaign, Rewards, Creator, FAQ, Updates, Comments, Community.
**FINAL STATE:** Full campaign context is accessible.

### USER FLOW ID: UF-CAMP-02
**USER FLOW NAME:** Save Campaign & Dashboard Sync
**ACTOR:** Authenticated User
**USER GOAL:** Bookmark a campaign and verify sync.
**PRECONDITIONS:** User is on `/campaign/solar`.
**STEPS:**
1. **User action:** Clicks "Save" on the campaign hero section.
2. **System response:** Button transforms to "Saved". Toast notification appears.
3. **User action:** Navigates to `/dashboard`.
4. **System response:** Profile header updates to "1 Saved". "Saved" tab displays the solar campaign card.
**FINAL STATE:** Global state synced between Campaign UI and Dashboard.
**SUCCESS PATH:** Bookmark state is preserved perfectly.

### USER FLOW ID: UF-DASH-01
**USER FLOW NAME:** Creator Dashboard Notifications
**ACTOR:** Authenticated Creator
**USER GOAL:** View platform alerts regarding submissions.
**PRECONDITIONS:** User recently completed UF-CREA-03 (Submitted campaign).
**STEPS:**
1. **User action:** Navigates to `/dashboard` (Overview tab).
2. **System response:** "Unread" notifications tray displays: "Your campaign was submitted for review".
3. **User action:** Clicks "My Campaigns" tab.
4. **System response:** Displays the campaign card with an "Under Review" status badge.
**FINAL STATE:** Creator is fully informed of their pending status.

---

## 6. Checkout & Pledging Flows

### USER FLOW ID: UF-BACK-01
**USER FLOW NAME:** Reward & Add-on Selection
**ACTOR:** Authenticated Backer
**USER GOAL:** Select a pledge tier and bypass empty add-ons.
**PRECONDITIONS:** User clicks "Back this project" on a campaign.
**STEPS:**
1. **User action:** Arrives at `/campaign/<slug>/back`.
2. **System response:** UI displays "Pledge without a reward" and specific tiers.
3. **User action:** Selects a specific tier.
4. **System response:** UI dynamically updates the right-hand cart summary. Proceeds to `/campaign/<slug>/back/addons`.
5. **System response:** If no add-ons exist, UI automatically displays a "No add-ons for this campaign" message and enables the "Continue to payment" button.
**FINAL STATE:** User progresses to payment view.

### USER FLOW ID: UF-BACK-02
**USER FLOW NAME:** Payment Terms Validation (Negative Path)
**ACTOR:** Authenticated Backer
**USER GOAL:** Prevent checkout without terms agreement.
**PRECONDITIONS:** User is on the `/campaign/<slug>/back/payment` step.
**STEPS:**
1. **User action:** Fills out Shipping details (Name, Address, Zip).
2. **User action:** Attempts to click "Complete Pledge".
3. **System response:** The button is completely `[disabled]` in the DOM because the "I agree to the Terms of Use" checkbox is unchecked.
**FINAL STATE:** User blocked from checking out.
**ERROR PATH:** Terms validation successfully halts illegal checkout.

### USER FLOW ID: UF-BACK-03
**USER FLOW NAME:** Complete Pledge (Positive Path)
**ACTOR:** Authenticated Backer
**USER GOAL:** Finalize backing a campaign.
**PRECONDITIONS:** User is on the Payment step.
**STEPS:**
1. **User action:** Checks the "I agree to the Terms of Use" checkbox.
2. **System response:** "Complete Pledge" button becomes `[active]`.
3. **User action:** Clicks "Complete Pledge".
4. **System response:** Processes payment and routes to `/campaign/<slug>/back/success`. Displays confirmation details.
5. **User action:** Navigates to `/dashboard` -> "Backed Projects".
6. **System response:** The campaign is instantly synced to the Backed grid.
**FINAL STATE:** Successful pledge transaction.

---

## 7. Informational & Legal Flows

### USER FLOW ID: UF-INFO-01
**USER FLOW NAME:** Global Static Page Navigation
**ACTOR:** Any User
**USER GOAL:** Access all platform marketing pages.
**STEPS:**
1. **User action:** Navigates through all footer links (`/explore`, `/how-it-works`, `/pricing`, `/creators`, `/backers`, `/mentors`, `/investors`, `/vendors`, `/about`, `/contact`).
2. **System response:** All endpoints resolve 200 OK. Correct `H1` tags and `<title>`s are rendered without 404 errors.
**FINAL STATE:** Marketing infrastructure verified.

### USER FLOW ID: UF-INFO-02
**USER FLOW NAME:** Dynamic Legal Hub Navigation
**ACTOR:** Any User
**USER GOAL:** Access Terms, Privacy, Cookies, and Accessibility policies.
**PRECONDITIONS:** User is at the footer.
**STEPS:**
1. **User action:** Clicks "Terms".
2. **System response:** Routes to `/legal?tab=terms`. Left sidebar button "Terms" becomes active.
3. **User action:** Clicks "Privacy Policy" from the sidebar.
4. **System response:** URL updates to `?tab=privacy`. Right-hand content swaps to Privacy text dynamically without a full page reload.
**FINAL STATE:** Legal hub operates smoothly via query parameters.

### USER FLOW ID: UF-INFO-03
**USER FLOW NAME:** Cookie Preferences Management
**ACTOR:** Any User
**USER GOAL:** Toggle cookie tracking permissions.
**PRECONDITIONS:** User is on `/legal?tab=cookies`.
**STEPS:**
1. **User action:** Observes "Manage Cookie Settings" form.
2. **System response:** "Essential Cookies" is permanently `[disabled]`/checked.
3. **User action:** Unchecks "Analytical Cookies" and clicks "Save Preferences".
4. **System response:** Button state actively registers the save event.
**FINAL STATE:** Preferences updated client-side.

### USER FLOW ID: UF-BUG-01
**USER FLOW NAME:** Footer Social Icons Interactivity (NEGATIVE BUG REPORT)
**ACTOR:** Any User
**USER GOAL:** Click social media links in the footer.
**PRECONDITIONS:** User scrolls to the bottom of any page.
**STEPS:**
1. **User action:** Hovers over the X, YouTube, LinkedIn, or Instagram icons.
2. **System response:** Icons trigger a hover effect (`hover:text-white`), tricking the user into thinking they are interactive.
3. **User action:** Clicks the icons.
4. **System response:** **FAILURE.** Nothing happens. The icons are wrapped in `<span>` tags instead of `<a>` tags and have absolutely no `href` attributes or routing logic attached.
**FINAL STATE:** User is stranded; social links are broken.
**ERROR PATH:** Critical UI bug identified in global footer component.

---
*Generated by Antigravity AI - Playwright MCP Verification Suite*
