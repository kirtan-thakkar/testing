# Final User Flow Inventory

---

## USER FLOW ID: UF-AUTH-01
## USER FLOW NAME: Valid User Login

**ACTOR:** Registered User
**USER GOAL:** Authenticate to gain access to the account dashboard.

**PRECONDITIONS:** User has a valid registered account. User is unauthenticated.

**START STATE:** User is on the Home page (`/`).

**STEP 1:**
**User action:** Clicks "Sign In" link in the header navigation.
**System response:** Redirects to `/login` and renders the authentication form.

**STEP 2:**
**User action:** Enters a valid email and valid password, then clicks "Log In".
**System response:** Authenticates the user, sets the secure session token, and automatically redirects the user to `/dashboard`.

**FINAL STATE:** User is authenticated and viewing their dashboard.

**SUCCESS PATH:** User successfully provides valid credentials and reaches the dashboard.
**ALTERNATE PATH:** An already authenticated user attempts to visit `/login` directly -> System automatically redirects them to `/dashboard`.
**ERROR PATH:** N/A for this specific success flow.
**RECOVERY PATH:** N/A

**EXISTING TEST CASES:** TC-001 (Authenticated redirect).
**MISSING TEST CASES:** Valid End-to-End Login via UI.

---

## USER FLOW ID: UF-AUTH-02
## USER FLOW NAME: User Logout

**ACTOR:** Authenticated User
**USER GOAL:** Securely terminate the active session.

**PRECONDITIONS:** User is actively logged in.

**START STATE:** User is viewing their `/dashboard`.

**STEP 1:**
**User action:** Clicks the "Settings" tab.
**System response:** System renders the Account Settings view, which includes a "Sign Out" option.

**STEP 2:**
**User action:** Clicks the "Sign Out" button.
**System response:** System destroys the user's session token and redirects the user back to the Home page (`/`).

**FINAL STATE:** User is fully logged out and unauthenticated.

**SUCCESS PATH:** User successfully terminates their session and returns to a public state.
**ALTERNATE PATH:** N/A
**ERROR PATH:** N/A
**RECOVERY PATH:** N/A

**EXISTING TEST CASES:** TC-002 (Sign Out).
**MISSING TEST CASES:** None.

---

## USER FLOW ID: UF-AUTH-03
## USER FLOW NAME: Invalid Login Handling

**ACTOR:** Unauthenticated User
**USER GOAL:** Attempt to log in, but fail due to missing or incorrect credentials.

**PRECONDITIONS:** None.

**START STATE:** User is on the `/login` page.

**STEP 1:**
**User action:** Clicks "Log In" without filling out the email or password fields.
**System response:** Client-side validation blocks the form submission and displays inline errors ("Invalid email address", "Too small").

**STEP 2:**
**User action:** Fills in an improperly formatted email or invalid credentials and clicks "Log In".
**System response:** System sends API request. The API responds with a `401 Unauthorized`. The UI displays an "Invalid email or password" error.

**STEP 3:**
**User action:** Submits incorrect credentials multiple consecutive times (up to 4 attempts).
**System response:** System continues to reject with `401 Unauthorized` and displays the same generic UI error. No immediate account lockout or CAPTCHA is triggered.

**FINAL STATE:** User remains on the `/login` page, unauthenticated.

**SUCCESS PATH:** N/A
**ALTERNATE PATH:** N/A
**ERROR PATH:** Missing credentials trigger local validation; incorrect credentials trigger server rejection.
**RECOVERY PATH:** User realizes their mistake, enters valid credentials, and successfully logs in (transitions to UF-AUTH-01).

**EXISTING TEST CASES:** TC-003 (Invalid login), TC-004 (Empty login).
**MISSING TEST CASES:** Lockout limits (e.g., test 10+ attempts).

---

## USER FLOW ID: UF-AUTH-04
## USER FLOW NAME: Password Recovery Journey

**ACTOR:** Registered User
**USER GOAL:** Regain account access by resetting a forgotten password.

**PRECONDITIONS:** User has an existing account but has forgotten the password.

**START STATE:** User is on the `/login` page.

**STEP 1:**
**User action:** Clicks the "Forgot password?" link.
**System response:** Redirects the user to `/forgot-password`.

**STEP 2:**
**User action:** Enters their registered email address and clicks "Send reset link".
**System response:** System sends an API request to trigger the reset email. The UI displays a success confirmation message.

**STEP 3:**
**User action:** (Outside application) Opens their email and clicks the secure reset link.
**System response:** Redirects the user to the `/reset-password` page with a secure token in the URL.

**STEP 4:**
**User action:** Enters a new valid password, confirms the password, and submits the form.
**System response:** System validates the token, updates the password, and redirects the user back to `/login`.

**FINAL STATE:** User is on the login page and ready to log in with the new password.

**SUCCESS PATH:** User requests, receives, and successfully executes the password reset.
**ALTERNATE PATH:** N/A
**ERROR PATH:** Needs verification (e.g., mismatched passwords in Step 4).
**RECOVERY PATH:** User remembers their password at Step 1 and clicks "Back to login" to abort the recovery process.

**EXISTING TEST CASES:** None.
**MISSING TEST CASES:** Entire password recovery flow.

---

## USER FLOW ID: UF-DISC-01
## USER FLOW NAME: Successful Campaign Search

**ACTOR:** Any User
**USER GOAL:** Find a specific active campaign using the search functionality.

**PRECONDITIONS:** At least one campaign matching the search term exists in the database.

**START STATE:** User is on the Home page (`/`).

**STEP 1:**
**User action:** Clicks the "Open search" button in the header navigation.
**System response:** Global search modal expands containing a "Search campaigns…" input.

**STEP 2:**
**User action:** Types a valid search query (e.g., "solar") and presses Enter.
**System response:** System queries the backend and updates the UI (or redirects to `/explore`) to display the matching campaign cards and a result count (e.g., "2 campaigns").

**FINAL STATE:** User views a populated list of relevant campaigns.

**SUCCESS PATH:** User searches for a term and successfully views matches.
**ALTERNATE PATH:** User performs the exact same search directly on the `/explore` page input instead of utilizing the header modal.
**ERROR PATH:** N/A
**RECOVERY PATH:** N/A

**EXISTING TEST CASES:** TC-005 (Explore page search), TC-006 (Global header search).
**MISSING TEST CASES:** None.

---

## USER FLOW ID: UF-DISC-02
## USER FLOW NAME: Unsuccessful Campaign Search (Empty State)

**ACTOR:** Any User
**USER GOAL:** Attempt to search for a campaign that does not exist.

**PRECONDITIONS:** None.

**START STATE:** User is on the `/explore` page.

**STEP 1:**
**User action:** Types a query with no possible matches (e.g., "xyz123") into the search input and presses Enter.
**System response:** System queries the backend, finds no matches, and updates the UI to display a "No Results" empty state.

**FINAL STATE:** User views the empty search state.

**SUCCESS PATH:** N/A (The user's core goal of finding a campaign failed, but the system behaved correctly).
**ALTERNATE PATH:** N/A
**ERROR PATH:** Query yields zero results.
**RECOVERY PATH:** User clears the search box and enters a broader term.

**EXISTING TEST CASES:** None.
**MISSING TEST CASES:** Empty search state rendering.

---

## USER FLOW ID: UF-BACK-01
## USER FLOW NAME: Campaign Pledge Checkout

**ACTOR:** Authenticated Backer
**USER GOAL:** Financially support a campaign by claiming a reward.

**PRECONDITIONS:** User is logged in. The target campaign is active.

**START STATE:** User is viewing a specific campaign page (e.g., `/campaign/solar`).

**STEP 1:**
**User action:** Clicks the "Back This Project" button or link.
**System response:** Redirects user to the reward selection step (`/campaign/[id]/back`).

**STEP 2:**
**User action:** Selects a specific reward tier and clicks "Continue".
**System response:** Progresses to the payment and shipping address form.

**STEP 3:**
**User action:** Attempts to click "Complete Pledge" without providing an address or checking the "Terms of Use" checkbox.
**System response:** Client-side validation disables the submission and displays error messages for the missing mandatory fields.

**STEP 4:**
**User action:** Corrects the errors by filling out a valid shipping address and checking the "Terms of Use", then clicks "Complete Pledge".
**System response:** Processes the pledge and redirects to a success confirmation screen displaying "You're a Backer!".

**FINAL STATE:** Pledge is successfully recorded and the user is confirmed as a backer.

**SUCCESS PATH:** User navigates the pledge flow, corrects validation errors, and successfully checks out.
**ALTERNATE PATH:** Needs verification (Does an unauthenticated user get correctly redirected back to the pledge flow if forced to log in mid-flow?).
**ERROR PATH:** Missing mandatory fields (Terms of Use, Address) blocks submission.
**RECOVERY PATH:** User uses the browser back button to select a different reward tier.

**EXISTING TEST CASES:** TC-007 (End-to-end pledge success).
**MISSING TEST CASES:** Form validation blocking (Terms of Use / Empty Address).

---

## USER FLOW ID: UF-CREA-01
## USER FLOW NAME: Single-Session Campaign Submission

**ACTOR:** Authenticated Creator
**USER GOAL:** Draft and submit a new campaign in a single continuous session.

**PRECONDITIONS:** User is logged in.

**START STATE:** User is on the `/start/application` wizard.

**STEP 1:**
**User action:** Fills out the required checkboxes and dropdowns on Step 1 ("Plan & Set Up"), then clicks "Continue".
**System response:** System saves the draft (`PUT /me/project-draft`) and progresses to Step 2.

**STEP 2:**
**User action:** Fills out the mandatory fields on Step 2 ("Build Campaign Page" - Title, Story, Goal) and clicks "Continue".
**System response:** System saves the draft and progresses to Step 3 ("Review & Submit").

**STEP 3:**
**User action:** Clicks "Submit for Review".
**System response:** System hits `POST /me/project-draft/submit`. Redirects to Step 4 ("Done") displaying a "Submission received!" and "UNDER REVIEW" status.

**FINAL STATE:** Campaign is submitted and awaiting administrative approval.

**SUCCESS PATH:** User successfully completes all steps and submits the campaign.
**ALTERNATE PATH:** N/A
**ERROR PATH:** Needs verification (Validation behavior if the user attempts to bypass mandatory fields).
**RECOVERY PATH:** User clicks a "Back" button within the wizard to amend details in Step 1.

**EXISTING TEST CASES:** TC-008 (Wizard success flow), Legacy-01, Legacy-02.
**MISSING TEST CASES:** Form validation blocking on empty required fields.

---

## USER FLOW ID: UF-CREA-02
## USER FLOW NAME: Multi-Session Campaign Drafting (Draft Persistence)

**ACTOR:** Authenticated Creator
**USER GOAL:** Start a campaign draft, leave the application, and resume work later without data loss.

**PRECONDITIONS:** User is logged in.

**START STATE:** User is on the `/start/application` wizard (Step 1).

**STEP 1:**
**User action:** Fills out Step 1 ("Plan & Set Up") and clicks "Continue".
**System response:** System saves the draft (`PUT /me/project-draft`) and progresses to Step 2.

**STEP 2:**
**User action:** Navigates entirely away from the application (e.g., clicks the Home link or closes the tab).
**System response:** System loads the Home page. The campaign remains safely stored as a draft in the backend.

**STEP 3:**
**User action:** Navigates back to `/start/application` at a later time.
**System response:** System loads the previously saved draft data and resumes the user's progress.

**FINAL STATE:** User is actively working on an accurately restored draft.

**SUCCESS PATH:** User successfully leaves and restores their draft.
**ALTERNATE PATH:** N/A
**ERROR PATH:** N/A
**RECOVERY PATH:** N/A

**EXISTING TEST CASES:** None.
**MISSING TEST CASES:** Draft persistence (leaving and returning).

---

## USER FLOW ID: UF-CREA-03
## USER FLOW NAME: Campaign Application - Step 1 Validation Errors

**ACTOR:** Authenticated Creator
**USER GOAL:** Verify that the system enforces mandatory fields on Step 1 of the application.

**PRECONDITIONS:** User is logged in.

**START STATE:** User is on the `/start/application` wizard (Step 1: Plan & Set Up).

**STEP 1:**
**User action:** Clicks the "Continue" button without checking the required checkboxes or filling out the Business Details (Country, Company Name, Business Address, PAN Card).
**System response:** Client-side validation blocks progression. The UI highlights the missing fields and displays red error text indicating the exact validation failures for the omitted required fields.

**FINAL STATE:** User remains on Step 1 and must correct the validation errors.

**SUCCESS PATH:** N/A
**ALTERNATE PATH:** N/A
**ERROR PATH:** User attempts to bypass mandatory checks, system enforces requirements.
**RECOVERY PATH:** User fills out the fields and clicks Continue (transitions to UF-CREA-04).

**EXISTING TEST CASES:** None.
**MISSING TEST CASES:** Granular form validation for Step 1.

---

## USER FLOW ID: UF-CREA-04
## USER FLOW NAME: Campaign Application - Step 1 Success

**ACTOR:** Authenticated Creator
**USER GOAL:** Successfully complete the Business Details and Category selection in Step 1.

**PRECONDITIONS:** User is logged in.

**START STATE:** User is on the `/start/application` wizard (Step 1: Plan & Set Up).

**STEP 1:**
**User action:** Checks the two required eligibility/terms checkboxes.
**System response:** UI updates to show checkboxes as checked.

**STEP 2:**
**User action:** Selects a Primary Category and a Subcategory from the dropdowns.
**System response:** UI registers the selections.

**STEP 3:**
**User action:** Fills in the required Business Details: Country, Company Name, Company Business Address, and PAN Card Number. (Optionally leaves GSTIN blank).
**System response:** Fields accept the input.

**STEP 4:**
**User action:** Clicks the "Continue" button.
**System response:** System saves the draft and successfully navigates the user to Step 2 (Build Campaign Page).

**FINAL STATE:** User has successfully completed Step 1 and is ready to enter campaign content.

**SUCCESS PATH:** User fills all mandatory business details and progresses.
**ALTERNATE PATH:** User optionally provides the GSTIN number.
**ERROR PATH:** N/A

**EXISTING TEST CASES:** TC-008 (covers this broadly, but not granularly).
**MISSING TEST CASES:** Step 1 specific completion assertion.

---

## USER FLOW ID: UF-ACCT-01
## USER FLOW NAME: Update Profile Bio

**ACTOR:** Authenticated User
**USER GOAL:** Update their public profile bio text.

**PRECONDITIONS:** User is logged in.

**START STATE:** User is on `/dashboard` and clicks the "Settings" tab.

**STEP 1:**
**User action:** Modifies the "Bio" textarea with new text and clicks "Save Changes".
**System response:** System sends a `PATCH /me` request, saves the profile data, and displays a success state.

**FINAL STATE:** Profile details are successfully updated.

**SUCCESS PATH:** Bio is updated and saved successfully.
**ALTERNATE PATH:** N/A
**ERROR PATH:** Needs verification (e.g., exceeding maximum character limits).
**RECOVERY PATH:** N/A

**EXISTING TEST CASES:** TC-009 (Bio update).
**MISSING TEST CASES:** Boundary testing (excessively long strings).

---

## USER FLOW ID: UF-ACCT-02
## USER FLOW NAME: Change Account Password

**ACTOR:** Authenticated User
**USER GOAL:** Securely change their account password.

**PRECONDITIONS:** User is logged in and has an existing password.

**START STATE:** User is on `/dashboard` and clicks the "Settings" tab.

**STEP 1:**
**User action:** Fills the "New password" and "Confirm new password" fields with a short invalid value (e.g., "short"), then clicks "Set password".
**System response:** Client-side validation intercepts the request and displays the inline error "Password must be at least 10 characters".

**STEP 2:**
**User action:** Corrects the fields by providing a valid, matching password (e.g., > 10 characters) and clicks "Set password".
**System response:** System processes the request securely and updates the password.

**FINAL STATE:** User's security credentials are successfully updated.

**SUCCESS PATH:** User triggers a validation error, corrects it, and successfully updates the password.
**ALTERNATE PATH:** User enters a valid password on the first try.
**ERROR PATH:** Password too short -> Validation error. Passwords do not match -> Validation error (Needs verification).
**RECOVERY PATH:** User clears the fields and re-enters the password to fix a mismatch.

**EXISTING TEST CASES:** TC-010 (Invalid short password).
**MISSING TEST CASES:** Valid password update execution. Mismatched password validation.

---

## USER FLOW ID: UF-AUTH-05
## USER FLOW NAME: User Registration and Verification Status Check

**ACTOR:** Unauthenticated Visitor / New User
**USER GOAL:** Create a new account and check email verification status.

**PRECONDITIONS:** User does not have an existing account with the provided email.

**START STATE:** User is on the Home page (`/`).

**STEP 1:**
**User action:** Clicks on Profile / header navigation and selects "Sign Up" / "Create Account".
**System response:** Redirects to the registration page (`/register`).

**STEP 2:**
**User action:** Enters their name, email, and password, then submits the form.
**System response:** Account is created. System authenticates the user and displays a message indicating an email has been sent to verify the account.

**STEP 3:**
**User action:** (Outside application) Checks their email inbox for the verification link.
**System response:** (POTENTIAL ISSUE) The verification email does not arrive.

**STEP 4:**
**User action:** Clicks on their Profile icon to check their account status.
**System response:** System navigates to the Dashboard, landing on the "Overview" tab by default.

**STEP 5:**
**User action:** Clicks on the "Settings" tab and scrolls to the email/account section.
**System response:** System displays the current email verification status (e.g., "Unverified").

**FINAL STATE:** User is successfully registered but remains unverified, and has located their status in the settings.

**SUCCESS PATH:** User successfully creates an account and navigates to the settings page to view their status.
**ALTERNATE PATH:** N/A
**ERROR PATH:** Verification email is not received (backend delivery failure).
**RECOVERY PATH:** Needs verification (Does the UI offer a "Resend verification email" button?).

**EXISTING TEST CASES:** None.
**MISSING TEST CASES:** End-to-end registration flow. Verification status UI assertion.
**EXISTING BEHAVIOR VERIFIED BY MCP:** Verified manually by the user (Registration succeeds, UI claims email sent, dashboard defaults to Overview, status is located in Settings).
**BEHAVIOR THAT STILL NEEDS VERIFICATION:** Backend email delivery functionality. Presence of a "resend" mechanism in settings.
