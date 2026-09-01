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

---

## 8. Admin Panel Flows

### USER FLOW ID: UF-ADMIN-01
**USER FLOW NAME:** Admin Approve & Publish Project (Positive Path)
**ACTOR:** Super Admin
**USER GOAL:** Review a submitted project and promote it to a live campaign draft.
**PRECONDITIONS:** User is authenticated as an Admin. At least one project exists in the "Under Review" state.
**STEPS:**
1. **User action:** Navigates to `/projects` from the Admin sidebar.
2. **User action:** Clicks "Review" on an "Under Review" project in the table.
3. **System response:** The project review page loads, displaying campaign info, business details, and review history.
4. **User action:** Clicks the "Approve & Publish" button.
5. **System response:** A confirmation dialog appears explaining that the funding goal will become locked.
6. **User action:** Clicks "Approve & Publish" inside the dialog.
7. **System response:** The system approves the project and instantly routes the Admin to `/campaigns/<id>`. The new campaign's status is set to "Not published (Draft)", and the final "Publish" button remains disabled until the creator adds at least one reward tier.
**FINAL STATE:** Project is successfully approved and transitioned into a Campaign draft.
**SUCCESS PATH:** Admin approves the campaign flawlessly.

### USER FLOW ID: UF-ADMIN-02
**USER FLOW NAME:** Admin Reject Project Submission (Negative Path)
**ACTOR:** Super Admin
**USER GOAL:** Reject a submitted project and provide feedback to the creator.
**PRECONDITIONS:** User is authenticated as an Admin. At least one project exists in the "Under Review" state.
**STEPS:**
1. **User action:** Navigates to `/projects` and clicks "Review" on a project.
2. **User action:** Clicks the "Reject…" button.
3. **System response:** The UI expands a "Rejection reason" textarea. The "Confirm rejection" button is strictly `[disabled]` initially.
4. **User action:** Types a detailed reason (e.g., "The project description needs to be more detailed.") into the textarea.
5. **System response:** The "Confirm rejection" button becomes `[active]`.
6. **User action:** Clicks "Confirm rejection".
7. **System response:** The project status instantly updates to "Rejected". A persistent alert banner renders at the top of the page displaying the exact rejection reason. The "Review history" log appends the rejection event, reason, timestamp, and the acting Admin's name.
**FINAL STATE:** Project is rejected and the reason is documented.
**ERROR PATH:** Admin successfully halts an invalid campaign submission.

### USER FLOW ID: UF-ADMIN-03
**USER FLOW NAME:** Admin Search & Filter Campaigns
**ACTOR:** Super Admin
**USER GOAL:** Find a specific campaign using the search and status filter.
**PRECONDITIONS:** User is logged in as Admin and on `/campaigns`.
**STEPS:**
1. **User action:** Types "solar" into the "Search by campaign name…" input.
2. **System response:** The table instantly filters to show only the matching campaign (`EcoLife Solar Purifier` / `solar`).
3. **User action:** Clears the search input and selects "Active" from the "Filter by status" dropdown.
4. **System response:** The table instantly filters out failed or funded campaigns, showing only "active" status campaigns.
**FINAL STATE:** Table accurately displays filtered records.

### USER FLOW ID: UF-ADMIN-04
**USER FLOW NAME:** Admin Create New Category
**ACTOR:** Super Admin
**USER GOAL:** Create a new hierarchical category for projects.
**PRECONDITIONS:** User is logged in as Admin and on `/categories`.
**STEPS:**
1. **User action:** Clicks "New category".
2. **System response:** A slide-out form appears.
3. **User action:** Types "Alien Technology" into the Name field.
4. **System response:** The Slug field auto-fills with `alien-technology`.
5. **User action:** Selects "Technology" as the Parent category and clicks "Create category".
6. **System response:** The category is saved and appears in the taxonomy tree.
**FINAL STATE:** A new nested category is created.

### USER FLOW ID: UF-ADMIN-05
**USER FLOW NAME:** Admin Create Application Field
**ACTOR:** Super Admin
**USER GOAL:** Define a required country-specific KYC field.
**PRECONDITIONS:** User is logged in as Admin and on `/country-fields`.
**STEPS:**
1. **User action:** Clicks "New field".
2. **System response:** A slide-out form appears.
3. **User action:** Selects Country (e.g. United States), sets Label ("SSN"), sets Key ("ssn"), adds Regex, and clicks "Create field".
4. **System response:** The new KYC requirement is saved and bound to the selected country.
**FINAL STATE:** Application field successfully added.

### USER FLOW ID: UF-ADMIN-06
**USER FLOW NAME:** Admin View Partners Tab
**ACTOR:** Super Admin
**USER GOAL:** Check partner applications.
**PRECONDITIONS:** User is logged in as Admin and on `/partners`.
**STEPS:**
1. **User action:** Clicks between the "Mentors", "Vendors", and "Investors" tabs.
2. **System response:** The view seamlessly swaps data states without a page reload, rendering "No applications yet" for empty lists.
**FINAL STATE:** Tabs successfully navigated.

### USER FLOW ID: UF-ADMIN-07
**USER FLOW NAME:** Admin View Payouts
**ACTOR:** Super Admin
**USER GOAL:** Review campaign payouts.
**PRECONDITIONS:** User is logged in as Admin and on `/finance/payouts`.
**STEPS:**
1. **User action:** Views the Payouts table.
2. **System response:** Renders payout rows and supports filtering by statuses (Awaiting release, Processing, Released, Failed, etc.).
**FINAL STATE:** Payouts can be filtered and exported to CSV.

### USER FLOW ID: UF-ADMIN-08
**USER FLOW NAME:** Admin Manage Pledges and Refunds
**ACTOR:** Super Admin
**USER GOAL:** Refund a specific backer's pledge.
**PRECONDITIONS:** User is logged in as Admin and on `/finance/pledges`.
**STEPS:**
1. **User action:** Clicks "Open" on a campaign to view its individual pledges (e.g., `/finance/pledges/<id>`).
2. **System response:** The individual pledges ledger is displayed.
3. **User action:** Clicks "Refund" on a specific pledge row.
4. **System response:** A "Refund this pledge" dialog opens. The "Refund" confirmation button is `[disabled]` initially.
5. **User action:** Types a refund reason (min 3 chars).
6. **System response:** The "Refund" confirmation button becomes enabled.
**FINAL STATE:** Admin is able to issue a refund.

### USER FLOW ID: UF-ADMIN-09
**USER FLOW NAME:** Admin View Refunds Log
**ACTOR:** Super Admin
**USER GOAL:** View the history of processed refunds.
**PRECONDITIONS:** User is logged in as Admin and on `/finance/refunds`.
**STEPS:**
1. **User action:** Views the Refunds table.
2. **System response:** Renders a list of all refunds (Campaign, Amount, Reason, Initiated by). Supports filtering by status.
**FINAL STATE:** Refund history is visible.

### USER FLOW ID: UF-ADMIN-10
**USER FLOW NAME:** Admin User Management
**ACTOR:** Super Admin
**USER GOAL:** Search for users and create new accounts.
**PRECONDITIONS:** User is logged in as Admin and on `/users`.
**STEPS:**
1. **User action:** Searches a user by name or filters by role.
2. **System response:** Table dynamically filters user accounts.
3. **User action:** Clicks "New user".
4. **System response:** The new user form is displayed (Identity, Profile, Billing, Delivery, Notifications, Access Role).
5. **User action:** Fills out user details and assigns a staff role, then clicks "Create user".
6. **System response:** The user is created and appears in the table.
**FINAL STATE:** A new user account is active.

### USER FLOW ID: UF-ADMIN-11
**USER FLOW NAME:** Admin Manage Roles
**ACTOR:** Super Admin
**USER GOAL:** Check and define staff roles and permissions.
**PRECONDITIONS:** User is logged in as Admin and on `/roles`.
**STEPS:**
1. **User action:** Views the list of system roles (Super Admin, Admin, Project Review Admin, etc.).
2. **User action:** Clicks "New role".
3. **System response:** The role creation modal opens, allowing the Admin to define the Role Name, Description, and Access Level (L2-L5).
**FINAL STATE:** A new custom staff role is defined.

### USER FLOW ID: UF-ADMIN-12
**USER FLOW NAME:** Admin Review Deletion Requests
**ACTOR:** Super Admin
**USER GOAL:** Review user account deletion requests.
**PRECONDITIONS:** User is logged in as Admin and on `/deletion-requests`.
**STEPS:**
1. **User action:** Filters the table by status (Pending, Approved, Rejected, etc.).
2. **System response:** Table displays matching deletion requests for review.
**FINAL STATE:** Admin processes account deletions.

### USER FLOW ID: UF-ADMIN-13
**USER FLOW NAME:** Admin Manage Contact Inbox
**ACTOR:** Super Admin
**USER GOAL:** Review and update status of contact form submissions.
**PRECONDITIONS:** User is logged in as Admin and on `/inbox`.
**STEPS:**
1. **User action:** Views contact form messages.
2. **System response:** Table displays From, Subject, Message, Status, Received Date.
3. **User action:** Changes the status of a message using the inline dropdown (e.g. from "new" to "in progress").
4. **System response:** The status is updated instantly.
**FINAL STATE:** Message status is recorded.

### USER FLOW ID: UF-ADMIN-14
**USER FLOW NAME:** Admin View Subscribers
**ACTOR:** Super Admin
**USER GOAL:** View and export newsletter subscribers.
**PRECONDITIONS:** User is logged in as Admin and on `/subscribers`.
**STEPS:**
1. **User action:** Views the subscribers table and tests the "Filter by status" dropdown.
2. **System response:** Table displays subscribed users and their source (e.g. footer, settings).
**FINAL STATE:** Subscribers are visible and can be exported.

### USER FLOW ID: UF-ADMIN-15
**USER FLOW NAME:** Admin Manage CMS Pages
**ACTOR:** Super Admin
**USER GOAL:** Create, view, and delete CMS marketing pages.
**PRECONDITIONS:** User is logged in as Admin and on `/cms`.
**STEPS:**
1. **User action:** Views the list of all marketing pages (e.g., Home, About, Creators).
2. **System response:** Table renders pages and allows sorting/filtering by status (Draft/Published).
3. **User action:** Clicks "New page".
4. **System response:** The CMS page editor opens.
5. **User action:** Clicks "Delete" on an existing page.
6. **System response:** The page is removed.
**FINAL STATE:** CMS Pages are managed.

### USER FLOW ID: UF-ADMIN-16
**USER FLOW NAME:** Admin Configure Global CMS Content
**ACTOR:** Super Admin
**USER GOAL:** Update Navigation and Site Settings.
**PRECONDITIONS:** User is logged in as Admin and on `/cms/navigation` or `/cms/settings`.
**STEPS:**
1. **User action:** On `/cms/navigation`, reorders navigation links using "Move up" / "Move down" buttons.
2. **System response:** Lists are updated dynamically.
3. **User action:** On `/cms/settings`, edits platform fee, support email, and footer legal links.
4. **System response:** Inputs are saved.
**FINAL STATE:** Global content structure and variables are updated.

### USER FLOW ID: UF-ADMIN-17
**USER FLOW NAME:** Admin View Notifications
**ACTOR:** Super Admin
**USER GOAL:** View and retry system notifications.
**PRECONDITIONS:** User is logged in as Admin and on `/notifications`.
**STEPS:**
1. **User action:** Views the list of all notifications sent by the platform.
2. **System response:** Table displays Event, Channel, Status, Provider, Created, and Actions (Retry).
3. **User action:** Filters by status (e.g. Failed) and channel (e.g. email).
**FINAL STATE:** Admin can audit and retry failed notifications.

### USER FLOW ID: UF-ADMIN-18
**USER FLOW NAME:** Admin View Activity Log
**ACTOR:** Super Admin
**USER GOAL:** Audit admin actions across the platform.
**PRECONDITIONS:** User is logged in as Admin and on `/activity`.
**STEPS:**
1. **User action:** Views the Activity table.
2. **System response:** Renders audit trail of actions (When, Actor, Action, Entity, IP).
**FINAL STATE:** Platform actions are audited.
