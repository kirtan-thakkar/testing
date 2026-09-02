# Functional Test Cases

## Test Case ID: FTC-AUTH-01
**User Flow ID:** UF-AUTH-01, UF-AUTH-02
**Test Case Name:** Valid End-to-End Login & Logout
**Actor:** Registered User
**Priority:** P0
**Description:** Verify that a registered user can successfully log in with valid credentials, access their dashboard, and securely log out.
**Preconditions:**
- The application environment is running and accessible.
- A registered user account exists.
- The user is currently unauthenticated.
**Test Data:**
- Valid registered email and password.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to the application Home page (`/`). | The Home page loads successfully with the public header visible. |
| 2 | Click on the "Sign In" link in the header navigation. | User is redirected to `/login`. The authentication form (Email/Password inputs) is visible. |
| 3 | Enter the registered user's valid Email address. | The email field accepts the input. |
| 4 | Enter the registered user's valid Password. | The password field accepts the input and characters are masked. |
| 5 | Click the "Log In" button. | The system authenticates the user and redirects them to the `/dashboard`. |
| 6 | Verify the Dashboard is displayed. | The Dashboard view loads. The user's profile information or "Overview" tab is visible. |
| 7 | Click the "Settings" tab on the Dashboard. | The Account Settings panel loads, displaying the "Sign Out" option. |
| 8 | Click the "Sign Out" button. | The user is redirected back to the Home page (`/`). |
| 9 | Attempt to navigate directly back to `/dashboard` via the browser address bar. | The system redirects the user back to the `/login` page or Home page, confirming the user is unauthenticated. |

**Postconditions:**
- The user is completely logged out and cannot access protected routes.

**Status:** PASS
**Automation Candidate:** Yes

---

## Test Case ID: FTC-AUTH-02
**User Flow ID:** UF-AUTH-03
**Test Case Name:** Invalid Login & Security Behavior
**Actor:** Unauthenticated User
**Priority:** P1
**Description:** Verify that the system correctly rejects incomplete or incorrect login attempts, displays appropriate validation and error messages, and does not immediately lock out users after a few failed attempts.
**Preconditions:**
- The application environment is running and accessible.
- The user is currently unauthenticated.
**Test Data:**
- Improperly formatted email (e.g., `invalid-email`).
- Unregistered email (e.g., `notreal@ideakicks.com`).
- Valid email but incorrect password.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to the application `/login` page. | The login form loads successfully. |
| 2 | Click the "Log In" button without filling out the email or password fields. | Form submission is blocked. Inline validation messages ("Invalid email address", "Too small") appear beneath the fields. |
| 3 | Enter an improperly formatted email and a random password, then click "Log In". | Form submission is blocked. Inline validation message "Invalid email address" appears beneath the email field. |
| 4 | Enter a well-formatted but unregistered email and a random password, then click "Log In". | Displays an "Invalid email or password" error message at the bottom of the screen. |
| 5 | Enter a registered email but an incorrect password, then click "Log In". | Displays the "Invalid email or password" error message. |
| 6 | Rapidly submit the same incorrect credentials 3 additional times (totaling 4 failed attempts). | The same "Invalid email or password" error is displayed each time. No immediate lockout screen or CAPTCHA is triggered on the 4th attempt. |
| 7 | Verify the user's view state. | The user remains unauthenticated on the `/login` page. |

**Postconditions:**
- The user remains unauthenticated.

**Status:** PASS
**Automation Candidate:** Yes

---

## Test Case ID: FTC-AUTH-03
**User Flow ID:** UF-AUTH-04
**Test Case Name:** Password Recovery Journey
**Actor:** Registered User
**Priority:** P0
**Description:** Verify that a registered user can successfully request a password reset link, receive the email, and securely change their password to regain access.
**Preconditions:**
- The application environment and email delivery service are running.
- The user has an existing registered account but forgot the password.
- The testing environment has access to the registered email inbox (requires a test email integration like Mailosaur or Mailtrap for automation).
**Test Data:**
- Registered email address with inbox access.
- New valid password.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to the application `/login` page and click "Forgot password?". | Redirects to `/forgot-password`. The reset request form is visible. |
| 2 | Enter the registered email address and click "Send reset link". | Displays a success confirmation message (e.g., "Reset link sent"). |
| 3 | (Test Environment) Access the target email inbox and retrieve the reset email. | The email arrives in the inbox and contains a reset link pointing to `/reset-password?token=...`. |
| 4 | Click the reset link from the email in the browser. | Redirects to `/reset-password` and renders the "New Password" and "Confirm Password" fields. |
| 5 | Enter "mismatch1" in New Password and "mismatch2" in Confirm Password, then submit. | Form submission is blocked and displays a "Passwords do not match" error. |
| 6 | Enter a valid new password in both fields, then click the submit button. | System redirects the user back to `/login` with a success toast/message indicating the password was updated. |
| 7 | On the `/login` page, enter the email and the *newly set password*, then click "Log In". | User is authenticated and redirected to `/dashboard`. |

**Postconditions:**
- The user can successfully log in using the newly created password and reaches the dashboard.

**Status:** NEEDS VERIFICATION (Email delivery and reset page flow have not been physically observed yet).
**Automation Candidate:** Needs environment support (Requires email API integration).

---

## Test Case ID: FTC-AUTH-04
**User Flow ID:** UF-AUTH-05
**Test Case Name:** User Registration and Verification Status Check
**Actor:** Unauthenticated Visitor / New User
**Priority:** P0
**Description:** Verify that a visitor can create a new account, is informed that an email has been sent, and can navigate to Settings to view their "Unverified" email status if the email does not arrive.
**Preconditions:**
- The user does not have an existing account with the provided email.
**Test Data:**
- Unregistered valid email address.
- Valid password.
- Name/Username.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to the Home page and select "Sign Up" / "Create Account" from the header/profile menu. | Redirects to the registration page (`/register`). |
| 2 | Enter name, email, and valid password, then submit the form. | Account is created. The UI logs the user in and displays a message indicating an email has been sent to verify the account. |
| 3 | (Test Environment) Access the target email inbox and check for the verification email. | POTENTIAL DEFECT: The verification email does not arrive in the inbox. |
| 4 | Within the application, click on the Profile icon. | System navigates to the Dashboard, landing on the "Overview" tab by default. |
| 5 | Click on the "Settings" tab and scroll down to the email section. | System displays the current email verification status as "Unverified". |

**Postconditions:**
- The user is authenticated but their email remains unverified in the Settings view.

**Status:** FAIL (Verification email delivery fails).
**Automation Candidate:** Yes (Can automate the registration and UI status check, but email delivery remains broken).

---

## Test Case ID: FTC-DISC-01
**User Flow ID:** UF-DISC-01
**Test Case Name:** Successful Campaign Search
**Actor:** Any User
**Priority:** P1
**Description:** Verify that a user can successfully search for an existing campaign using the global header search and view the results.
**Preconditions:**
- The application environment is running.
- At least one active campaign containing the search term exists in the database.
**Test Data:**
- A valid search query (e.g., "solar").

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to the application Home page (`/`). | The Home page loads successfully. |
| 2 | Click the "Open search" button (magnifying glass) in the header navigation. | The global search modal expands, displaying a "Search campaigns…" input field. |
| 3 | Type a valid search query into the input field and press Enter. | The UI navigates to the `/explore` page (or updates the view) and displays campaign cards matching the query, along with a result count indicating the number of matches. |
| 4 | Click on one of the resulting campaign cards. | The UI navigates to the specific campaign's detail page (`/campaign/[id]`). |

**Postconditions:**
- The user successfully locates and views a campaign of interest.

**Status:** PASS
**Automation Candidate:** Yes

---

## Test Case ID: FTC-DISC-02
**User Flow ID:** UF-DISC-02
**Test Case Name:** Unsuccessful Campaign Search (Empty State)
**Actor:** Any User
**Priority:** P2
**Description:** Verify that searching for a term with no matches correctly triggers the "No Results" empty state without breaking the UI.
**Preconditions:**
- The application environment is running.
**Test Data:**
- A random gibberish query guaranteed to have no matches (e.g., `xyz123nonsense`).

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to the `/explore` page. | The Explore page loads, displaying categories and default campaign cards. |
| 2 | Locate the main search input field, type the gibberish query, and press Enter. | The UI clears the existing campaign cards and prominently displays a "No campaigns found" empty state message. |
| 3 | Clear the search input field. | The UI removes the empty state and restores the default campaign list. |

**Postconditions:**
- The user experiences a graceful empty state and can easily recover.

**Status:** PASS
**Automation Candidate:** Yes

---

## Test Case ID: FTC-DISC-03
**User Flow ID:** UF-DISC-03
**Test Case Name:** Global Header Search Navigation
**Actor:** Any User
**Priority:** P1
**Description:** Verify that clicking "Open search" in the global navigation bar expands the search input, accepts a query, and successfully redirects the user to the `/explore` page with the corresponding search results rendered.
**Preconditions:**
- The application environment is running.
**Test Data:**
- Search query: `solar`

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | From the Home page (`/`), click the "Open search" button in the top navigation bar. | The global navigation bar transforms to display an active text input (`placeholder: Search campaigns…`). |
| 2 | Type `solar` into the input and press Enter. | The browser navigates to `/explore?q=solar`. |
| 3 | Observe the Discover Campaigns page. | The main search input is pre-filled with `solar`. The UI filters the campaign list to match the query (e.g., displaying "solar" and "EcoLife Solar Purifier") and updates the count metric (e.g., "2 campaigns"). |

**Postconditions:**
- The user is seamlessly routed from the global header to the dedicated discovery page with contextual results.

**Status:** PASS (Verified via MCP).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-DISC-04
**User Flow ID:** UF-DISC-04
**Test Case Name:** Explore Category Filtering
**Actor:** Any User
**Priority:** P1
**Description:** Verify that clicking category filter buttons on the `/explore` page dynamically updates the active filter state, the results counter, the "Showing [Category]" text, and filters the rendered campaign cards accordingly.
**Preconditions:**
- The application environment is running.
- User is on `/explore`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Observe the category filter bar below the search input. | A horizontal list of category buttons (e.g. All, Art & Photography, Technology) is visible. "All" is active by default. |
| 2 | Click the "Technology" category button. | The "Technology" button enters the `[active]` state. |
| 3 | Observe the results section. | The UI dynamically updates the campaign counter and displays the text "Showing Technology". Only campaigns belonging to the "Technology" category are rendered in the grid. |

**Postconditions:**
- The user can seamlessly filter campaigns by category without full page reloads.

**Status:** PASS (Verified active state, text update, and filtered grid via MCP).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-BACK-01
**User Flow ID:** UF-BACK-01
**Test Case Name:** Campaign Pledge Reward Selection
**Actor:** Authenticated Backer
**Priority:** P0
**Description:** Verify that clicking "Back This Project" takes the user to the reward selection flow, renders the available options ("Pledge without a reward" and specific tiers), and dynamically updates the cart summary when a tier is selected.
**Preconditions:**
- The application environment is running.
- The user is authenticated.
- A live campaign exists and is accepting pledges.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to a specific live campaign page (e.g., `/campaign/solar`). | The campaign detail page loads successfully. |
| 2 | Click the "Back This Project" button. | The UI redirects to `/campaign/[slug]/back`. The step tracker (`Reward -> Add-ons -> Payment`) is visible. |
| 3 | Observe the "Select your reward" section. | The UI presents a "Pledge without a reward" option and the creator's specific reward tier options (e.g. "testing"). |
| 4 | Click a specific reward tier. | The "Pledge summary" sidebar dynamically updates to show the selected Reward cost, Shipping cost, and calculated Total. An optional "Bonus support" spinbutton and a "Continue" button appear inline. |
| 5 | Click "Continue". | The UI progresses to the Add-ons (if applicable) or directly to the Payment/Checkout stage. |

**Postconditions:**
- The user reaches the Payment/Checkout stage with the correct items in their cart.

**Status:** PASS (Verified via MCP).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-BACK-02
**User Flow ID:** UF-BACK-02
**Test Case Name:** Campaign Pledge Checkout & Shipping
**Actor:** Authenticated Backer
**Priority:** P0
**Description:** Verify that the Payment step requires shipping details and mandates the "Terms of Use" checkbox before the submit button is enabled.
**Preconditions:**
- The user has selected a reward and is on the "Payment" checkout stage (`/campaign/[slug]/back`).
**Test Data:**
- Valid shipping address details.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Observe the Payment screen. | The "Shipping address" section renders inputs for Street address, Apartment, City, State, Postal code, and Country. Checkboxes for "Hide my name" and "Terms of Use" are visible. |
| 2 | Do not check the "Terms of Use" checkbox. | The "Complete Pledge" button remains physically disabled (`[disabled]` state). |
| 3 | Check the "I agree to the Terms of Use..." checkbox and fill out the mandatory shipping fields. | The "Complete Pledge" button enables. |
| 4 | Click the "Complete Pledge" button. | The pledge is processed and the user is redirected to the confirmation screen. |

**Postconditions:**
- The pledge is recorded and the user becomes a backer.

**Status:** PASS (Steps 1-3 verified via MCP). Step 4 NEEDS VERIFICATION.
**Automation Candidate:** Yes

---

## Test Case ID: FTC-BACK-03
**User Flow ID:** UF-BACK-03
**Test Case Name:** Pledge Confirmation & Dashboard Sync
**Actor:** Authenticated Backer
**Priority:** P0
**Description:** Verify that clicking "Complete Pledge" transitions the user to the confirmation screen with the exact pledge summary and action buttons, and that the dashboard correctly syncs the newly backed campaign.
**Preconditions:**
- The user has checked "Terms of Use", filled the shipping form, and clicked "Complete Pledge".
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Wait for submission to complete. | The UI transitions to the confirmation page displaying a "You're a Backer!" H1 heading. |
| 2 | Observe the confirmation screen. | The screen displays the correct Pledge Summary (Reward, Shipping, Total) and Est. Delivery date. Three action elements are visible: "Back to Campaign", "Share on X", and "Copy Link". |
| 3 | Navigate to the Profile Dashboard (`/dashboard`). | The global profile stats update (e.g., increments to "1 Backed"). |
| 4 | Click the "Backed Projects" tab. | The backed campaign is listed in the grid. The card displays the campaign title, "confirmed" status, the specific reward tier selected, the estimated delivery, and the exact total amount pledged. |

**Postconditions:**
- The pledge is successfully verified in the UI and synced to the dashboard.

**Status:** PASS (Verified confirmation screen and Dashboard sync via MCP).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-CREA-01
**User Flow ID:** UF-CREA-03
**Test Case Name:** Campaign Application Step 1 Validation
**Actor:** Authenticated Creator
**Priority:** P1
**Description:** Verify that the "Plan & Set Up" step rigorously enforces mandatory fields (Business Details, PAN, checkboxes) before allowing progression.
**Preconditions:**
- The application environment is running.
- The user is authenticated.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to "How it works" and click "Start a Project". | The `/start/application` wizard loads, displaying Step 1 ("Plan & Set Up"). |
| 2 | Scroll to the bottom and click "Continue" without interacting with any fields. | Client-side validation blocks progression. Red validation error text is displayed indicating that the checkboxes must be checked, categories must be selected, and business details (Country, Company Name, Address, PAN Card) are required. |
| 3 | Check the two required checkboxes, select categories, but omit the PAN Card number. Click "Continue". | Progression is blocked. A specific red validation error remains under the PAN Card input field. |

**Postconditions:**
- The user remains on Step 1 and is forced to provide valid data.

**Status:** NEEDS VERIFICATION (Verify exact red error text wording in UI).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-CREA-02
**User Flow ID:** UF-CREA-04
**Test Case Name:** Campaign Application Step 1 Success
**Actor:** Authenticated Creator
**Priority:** P0
**Description:** Verify that a user can successfully complete Step 1 by providing all mandatory business details.
**Preconditions:**
- The application environment is running.
- The user is authenticated and on Step 1 of the application wizard.
**Test Data:**
- Primary Category & Subcategory.
- Valid Country, Company Name, Business Address, PAN Card number.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Check both required eligibility checkboxes. | UI reflects checkboxes as checked. |
| 2 | Select a Primary Category and Subcategory. | UI displays the selected categories. |
| 3 | Enter valid data into Country, Company Name, Company Business Address, and PAN Card Number fields. | Fields accept the input text. |
| 4 | Leave the "GSTIN (if applicable)" field blank. | The field remains blank (testing optionality). |
| 5 | Click the "Continue" button. | The UI successfully transitions the user to Step 2 ("Build Campaign Page"). |

**Postconditions:**
- The user successfully progresses to the next stage of the application.

**Status:** PASS
**Automation Candidate:** Yes

---

## Test Case ID: FTC-CREA-03
**User Flow ID:** UF-CREA-01
**Test Case Name:** Campaign Submission & Admin Review State
**Actor:** Authenticated Creator
**Priority:** P0
**Description:** Verify that completing the application wizard successfully submits the campaign and places it into an "Under Review" state, preventing it from appearing immediately on the public dashboard.
**Preconditions:**
- The user has completed Step 1 and is on Step 2.
**Test Data:**
- Valid campaign Title, Story, Funding Goal.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Fill out all mandatory fields on Step 2 (Title, Story, Goal) and click "Continue". | The UI transitions to Step 3 ("Review & Submit"). |
| 2 | Click "Submit for Review". | The UI transitions to Step 4 ("Done") and explicitly displays a "Submission received!" or "UNDER REVIEW" status banner. |
| 3 | Navigate to the public Home page (`/`) or Explore page (`/explore`). | The newly submitted campaign does **not** appear in the live, public lists. |
| 4 | Navigate to the user's Creator Dashboard. | The campaign appears in a "Created Projects" or "Pending" list, distinctly marked as requiring Admin Verification/Approval. |

**Postconditions:**
- The campaign is safely captured by the backend but is gated from public view until admin approval.

**Status:** PASS (Steps 1-3 verified). Step 4 NEEDS VERIFICATION.
**Automation Candidate:** Yes

---

## Test Case ID: FTC-CREA-04
**User Flow ID:** UF-CREA-05
**Test Case Name:** Campaign Application Step 2 Validation
**Actor:** Authenticated Creator
**Priority:** P1
**Description:** Verify that the "Build Campaign Page" step enforces mandatory content fields (Title, Story, Goal, Cover Image) and strict constraints (e.g., Story length) before allowing progression.
**Preconditions:**
- The user successfully completed Step 1 and is on Step 2.
**Test Data:**
- Invalid Story: "Too short"

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Scroll to the bottom and click "Continue" without interacting with any fields. | Client-side validation blocks progression. Red validation errors highlight the Project Title, Project Story, Funding Goal, and Cover Image fields as required. |
| 2 | Enter "Too short" into the Project Story and click "Continue". | Progression is blocked. A specific validation error appears indicating the story must be at least 30 characters. |
| 3 | Enter valid text for Title and Story (30+ chars), but leave the Cover Image blank. Click "Continue". | Progression is blocked. A validation error requires a Cover Image upload. |

**Postconditions:**
- The user remains on Step 2 and is forced to provide valid campaign content.

**Status:** NEEDS VERIFICATION (Visual confirm of red error text).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-CREA-05
**User Flow ID:** UF-CREA-06
**Test Case Name:** Campaign Application Step 2 Success
**Actor:** Authenticated Creator
**Priority:** P0
**Description:** Verify that a user can successfully complete Step 2 by providing valid campaign content and media.
**Preconditions:**
- The user is on Step 2 of the application wizard.
**Test Data:**
- Title: "EcoLife Solar Purifier"
- Story: "This is a detailed story explaining the project which exceeds the thirty character minimum limit."
- Goal: `50000`
- Image: Valid PNG file under 10MB.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Enter the test Title, Story (30+ chars), and Funding Goal. | Fields accept the input text/numbers. |
| 2 | Click "Upload cover image" and upload the test PNG file. | The UI displays a thumbnail preview or filename confirming the image is staged. |
| 3 | Optionally enter a valid YouTube URL in the "Pitch Video URL" field. | Field accepts input. |
| 4 | Click the "Continue" button. | The system saves the draft and successfully transitions the user to Step 3 ("Review & Submit"). |

**Postconditions:**
- The user successfully progresses to the final review stage.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ACCT-01
**User Flow ID:** UF-ACCT-01
**Test Case Name:** Update Profile Bio and Links
**Actor:** Authenticated User
**Priority:** P2
**Description:** Verify that a user can successfully update their profile biography and social links from the Settings dashboard and save the changes.
**Preconditions:**
- The application environment is running.
- The user is authenticated.
**Test Data:**
- Bio: "A passionate creator."
- Website: "https://myportfolio.com"

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to the Dashboard and click the "Settings" tab. | The Settings view loads, displaying fields for Display Name, Username, Bio, and Links (Website, Twitter, Instagram, LinkedIn). |
| 2 | Scroll to the "BIO" field and enter the test bio string. | The text area accepts the input. |
| 3 | Scroll to the "WEBSITE" field under LINKS and enter the URL. | The input field accepts the text. |
| 4 | Click the "Save Changes" button. | The UI displays a success toast/banner indicating the profile was updated. (Needs Verification: does the page reload or just show a toast?). |
| 5 | Navigate away from the page (e.g., to `/explore`) and then return to Settings. | The Bio and Website fields correctly display the updated data, confirming persistence. |

**Postconditions:**
- The user's profile is permanently updated with the new bio and link.

**Status:** NEEDS VERIFICATION (Save success UI behavior needs visual confirmation).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ACCT-02
**User Flow ID:** UF-ACCT-02
**Test Case Name:** Change Account Password Validation
**Actor:** Authenticated User
**Priority:** P1
**Description:** Verify that a user can change their password, and that the system strictly enforces the current password requirement and the new password match validation.
**Preconditions:**
- The application environment is running.
- The user is authenticated.
**Test Data:**
- Valid current password.
- Valid new password.
- Mismatched confirmation password.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to the Dashboard and click the "Settings" tab. | The Settings view loads. |
| 2 | Scroll down to the "Change password" section. | The fields `CURRENT PASSWORD`, `NEW PASSWORD`, and `CONFIRM NEW PASSWORD` are visible, along with an "Update password" button. |
| 3 | Attempt to submit the form leaving all fields blank by clicking "Update password". | Client-side validation blocks the submission and highlights the required fields. |
| 4 | Enter the correct `CURRENT PASSWORD`, but enter mismatched strings into `NEW PASSWORD` and `CONFIRM NEW PASSWORD`. Click "Update password". | Validation blocks submission and displays a "Passwords do not match" error. |
| 5 | Enter an *incorrect* `CURRENT PASSWORD`, and a matching valid `NEW PASSWORD` and `CONFIRM NEW PASSWORD`. Click "Update password". | The system attempts the change but returns an error banner/toast stating the current password is incorrect. |
| 6 | Enter the correct `CURRENT PASSWORD`, and matching valid strings for the new passwords. Click "Update password". | The system successfully updates the password and displays a success confirmation message. |

**Postconditions:**
- The user's password is changed.

**Status:** NEEDS VERIFICATION (Validation error text exact wording).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-INFO-01
**User Flow ID:** UF-INFO-01
**Test Case Name:** Global Static Page Navigation
**Actor:** Any User (Authenticated or Unauthenticated)
**Priority:** P1
**Description:** Verify that all informational and footer pages load successfully without 404 errors and render the correct primary headings (`<h1>`) and document `<title>`s. This ensures the structural integrity of the application's non-dynamic marketing/information pages.
**Preconditions:**
- The application environment is running.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Click the logo or navigate to `/`. | The Home page loads displaying the H1: "Back vetted ideas. Start what moves." |
| 2 | Click "Discover" or navigate to `/explore`. | The Explore page loads displaying the H1: "Discover Campaigns". |
| 3 | Click "How it works" or navigate to `/how-it-works`. | The How It Works page loads displaying the H1: "How ideakicks works". |
| 4 | Click "Start a Project" or navigate to `/start`. | The Creator landing page loads displaying the H1: "Launch your next big idea." |
| 5 | Click "About" or navigate to `/about`. | The About page loads displaying the H1: "We believe every great idea deserves a real audience." |
| 6 | Navigate to the footer link `/pricing`. | The Pricing page loads displaying the H1: "No success, no fee." |
| 7 | Navigate to the footer link `/success-stories`. | The Success Stories page loads displaying the H1: "Ideas that went the distance." |
| 8 | Navigate to the footer link `/creators`. | The For Creators page loads displaying the H1: "Your idea. Our platform. Their backing." |
| 9 | Navigate to the footer link `/backers`. | The For Backers page loads displaying the H1: "Back ideas that matter. Before anyone else." |
| 10 | Navigate to the footer link `/mentors`. | The For Mentors page loads displaying the H1: "Your experience. Their breakthrough." |
| 11 | Navigate to the footer link `/contact`. | The Contact page loads displaying the H1: "Get in touch". |

**Postconditions:**
- User can freely navigate all informational routes without encountering any server errors or broken UI layouts.

**Status:** PASS (Verified all endpoints resolve successfully).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-INFO-02
**User Flow ID:** UF-INFO-02
**Test Case Name:** Legal Hub Navigation
**Actor:** Any User
**Priority:** P2
**Description:** Verify that clicking the legal footer links (Terms, Privacy, Cookies, Wheelchair) routes the user to the centralized `/legal` page and dynamically switches the active tab content based on the URL parameter (`?tab=...`).
**Preconditions:**
- The application environment is running.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Scroll to the footer and click the "Terms" link. | The UI routes to `/legal?tab=terms`. The primary `H2` reads "Terms of Use" and the sidebar "Terms of Use" button is in the `[active]` state. |
| 2 | From the sidebar, click the "Privacy Policy" button. | The URL updates to `/legal?tab=privacy`. The main content dynamically re-renders to display the `H2` "Privacy Policy", replacing the Terms of Use content. |
| 3 | Scroll to the footer and click the "Cookies" link. | The UI routes to `/legal?tab=cookies`. The content updates to display Cookie preferences information. |
| 4 | Scroll to the footer and click the "Wheelchair" link. | The UI routes to `/legal?tab=accessibility`. The content updates to display the Accessibility Statement. |

**Postconditions:**
- The user can seamlessly view all legal documentation without full page reloads breaking the sidebar layout.

**Status:** PASS (Verified Terms and Privacy states via MCP).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-INFO-03
**User Flow ID:** UF-INFO-03
**Test Case Name:** Cookie Preferences Management
**Actor:** Any User
**Priority:** P2
**Description:** Verify that users can interact with the Cookie Policy preferences form to toggle specific cookie categories (Analytical, Marketing) while Essential cookies remain disabled, and that they can save their preferences.
**Preconditions:**
- The application environment is running.
- User is navigated to `/legal?tab=cookies`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Observe the "Manage Cookie Settings" form. | The form displays three checkboxes: "Essential Cookies" (checked and disabled), "Analytical Cookies" (checked), and "Marketing Cookies" (checked). |
| 2 | Click the "Analytical Cookies" checkbox. | The checkbox toggles to the unchecked state. |
| 3 | Click the "Save Preferences" button. | The UI registers the interaction and the button state updates (or a confirmation is shown) indicating preferences are saved. |

**Postconditions:**
- Cookie preferences are updated locally.

**Status:** PASS (Verified checkbox toggling and Save button interaction via MCP).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-CAMP-01
**User Flow ID:** UF-CAMP-01
**Test Case Name:** Campaign Details & Tabs Rendering
**Actor:** Any User
**Priority:** P1
**Description:** Verify that clicking a campaign from the Explore page loads the Campaign Details page correctly, displaying all primary metadata and rendering the inner navigational tabs (Campaign, Rewards, Creator, FAQ, Updates, Comments, Community).
**Preconditions:**
- Application is running.
- The database contains at least one active campaign.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to `/explore` and click on any campaign card (e.g., "solar"). | The browser navigates to `/campaign/<slug>`. The Campaign Details hero section renders with the Title, Creator Name, Main Image, Funding Progress (amount raised, percentage, backers, days left), and a "Back This Project" button. |
| 2 | Observe the secondary navigation bar below the hero section. | The following tabs are visible and clickable: `Campaign`, `Rewards`, `Creator`, `FAQ`, `Updates`, `Comments`, `Community`. |

**Postconditions:**
- The Campaign Details page is fully loaded and structurally intact.

**Status:** PASS (Verified via MCP).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-CAMP-02
**User Flow ID:** UF-CAMP-02
**Test Case Name:** Save Campaign & Dashboard Sync
**Actor:** Authenticated User
**Priority:** P0
**Description:** Verify that a user can bookmark a campaign by clicking "Save", that the UI state updates immediately (button changes to "Saved" + Toast notification), and that the saved campaign successfully syncs to the user's Dashboard profile under the "Saved" tab.
**Preconditions:**
- User is authenticated.
- User is on a Campaign Details page (e.g., `/campaign/solar`) that is not currently saved.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Click the "Save" button on the Campaign Details page. | A Toast notification confirms the action. The button text explicitly changes from "Save" to "Saved". |
| 2 | Navigate to the Profile Dashboard (`/dashboard`). | The user's summary metrics update (e.g., "1 Saved"). |
| 3 | Click the "Saved" tab in the dashboard navigation. | The saved campaign (e.g., "solar") is listed as a card in the Saved grid. |
| 4 | Click the "Remove [campaign] from saved" button on the card. | The campaign is immediately removed from the Saved grid, and the saved counter decrements. |

**Postconditions:**
- The campaign save state is accurately persisted and synced across the Campaign Details UI and the User Dashboard.

**Status:** PASS (Verified Save state, Dashboard sync, and Unsave flow via MCP).
**Automation Candidate:** Yes

---

## Test Case ID: FTC-DASH-01
**User Flow ID:** UF-DASH-01
**Test Case Name:** Creator Dashboard & Notifications
**Actor:** Authenticated Creator
**Priority:** P1
**Description:** Verify that the dashboard accurately reflects submitted campaigns under "My Campaigns" and that the platform's notification system correctly alerts users to state changes (e.g., campaign submission).
**Preconditions:**
- User is authenticated.
- User has recently submitted a campaign that is currently "Under Review".
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to `/dashboard` and observe the "Overview" tab. | The "Unread" Notifications section displays an alert stating "Your campaign was submitted for review". |
| 2 | Click the "My Campaigns" tab. | The newly submitted campaign is listed as a card. |
| 3 | Observe the campaign card metadata. | The card displays the Title, Funding Goal, and a distinct "Under Review" status badge. The subtitle explicitly notes the submission date and the 1-3 business day review SLA. |

**Postconditions:**
- The user is fully informed of their campaign's status via both the notification tray and the dedicated campaigns tab.

**Status:** PASS (Verified via MCP).
**Automation Candidate:** Yes
# Admin Functional Test Cases

## Test Case ID: FTC-BUG-01
**User Flow ID:** UF-BUG-01
**Test Case Name:** Footer Social Icons Interactivity (NEGATIVE BUG REPORT)
**Actor:** Any User
**Priority:** P1
**Description:** Click social media links in the footer.
**Preconditions:**
- User scrolls to the bottom of any page.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Hovers over the X, YouTube, LinkedIn, or Instagram icons. | Icons trigger a hover effect (`hover:text-white`), tricking the user into thinking they are interactive. |
| 2 | Clicks the icons. | **FAILURE.** Nothing happens. The icons are wrapped in `<span>` tags instead of `<a>` tags and have absolutely no `href` attributes or routing logic attached. |

**Postconditions:**
- User is stranded; social links are broken.

**Status:** FAIL (Bug identified)
**Automation Candidate:** No (Bug report)

---

## Test Case ID: FTC-ADMIN-01
**User Flow ID:** UF-ADMIN-01
**Test Case Name:** Admin Approve & Publish Project (Positive Path)
**Actor:** Super Admin
**Priority:** P1
**Description:** Review a submitted project and promote it to a live campaign draft.
**Preconditions:**
- User is authenticated as an Admin. At least one project exists in the "Under Review" state.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigates to `/projects` from the Admin sidebar. | |
| 2 | Clicks "Review" on an "Under Review" project in the table. | The project review page loads, displaying campaign info, business details, and review history. |
| 3 | Clicks the "Approve & Publish" button. | A confirmation dialog appears explaining that the funding goal will become locked. |
| 4 | Clicks "Approve & Publish" inside the dialog. | The system approves the project and instantly routes the Admin to `/campaigns/<id>`. The new campaign's status is set to "Not published (Draft)", and the final "Publish" button remains disabled until the creator adds at least one reward tier. |

**Postconditions:**
- Project is successfully approved and transitioned into a Campaign draft.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-02
**User Flow ID:** UF-ADMIN-02
**Test Case Name:** Admin Reject Project Submission (Negative Path)
**Actor:** Super Admin
**Priority:** P1
**Description:** Reject a submitted project and provide feedback to the creator.
**Preconditions:**
- User is authenticated as an Admin. At least one project exists in the "Under Review" state.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigates to `/projects` and clicks "Review" on a project. | |
| 2 | Clicks the "Reject…" button. | The UI expands a "Rejection reason" textarea. The "Confirm rejection" button is strictly `[disabled]` initially. |
| 3 | Types a detailed reason (e.g., "The project description needs to be more detailed.") into the textarea. | The "Confirm rejection" button becomes `[active]`. |
| 4 | Clicks "Confirm rejection". | The project status instantly updates to "Rejected". A persistent alert banner renders at the top of the page displaying the exact rejection reason. The "Review history" log appends the rejection event, reason, timestamp, and the acting Admin's name. |

**Postconditions:**
- Project is rejected and the reason is documented.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-03
**User Flow ID:** UF-ADMIN-03
**Test Case Name:** Admin Search & Filter Campaigns
**Actor:** Super Admin
**Priority:** P1
**Description:** Find a specific campaign using the search and status filter.
**Preconditions:**
- User is logged in as Admin and on `/campaigns`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Types "solar" into the "Search by campaign name…" input. | The table instantly filters to show only the matching campaign (`EcoLife Solar Purifier` / `solar`). |
| 2 | Clears the search input and selects "Active" from the "Filter by status" dropdown. | The table instantly filters out failed or funded campaigns, showing only "active" status campaigns. |

**Postconditions:**
- Table accurately displays filtered records.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-04
**User Flow ID:** UF-ADMIN-04
**Test Case Name:** Admin Create New Category
**Actor:** Super Admin
**Priority:** P1
**Description:** Create a new hierarchical category for projects.
**Preconditions:**
- User is logged in as Admin and on `/categories`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Clicks "New category". | A slide-out form appears. |
| 2 | Types "Alien Technology" into the Name field. | The Slug field auto-fills with `alien-technology`. |
| 3 | Selects "Technology" as the Parent category and clicks "Create category". | The category is saved and appears in the taxonomy tree. |

**Postconditions:**
- A new nested category is created.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-05
**User Flow ID:** UF-ADMIN-05
**Test Case Name:** Admin Create Application Field
**Actor:** Super Admin
**Priority:** P1
**Description:** Define a required country-specific KYC field.
**Preconditions:**
- User is logged in as Admin and on `/country-fields`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Clicks "New field". | A slide-out form appears. |
| 2 | Selects Country (e.g. United States), sets Label ("SSN"), sets Key ("ssn"), adds Regex, and clicks "Create field". | The new KYC requirement is saved and bound to the selected country. |

**Postconditions:**
- Application field successfully added.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-06
**User Flow ID:** UF-ADMIN-06
**Test Case Name:** Admin View Partners Tab
**Actor:** Super Admin
**Priority:** P1
**Description:** Check partner applications.
**Preconditions:**
- User is logged in as Admin and on `/partners`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Clicks between the "Mentors", "Vendors", and "Investors" tabs. | The view seamlessly swaps data states without a page reload, rendering "No applications yet" for empty lists. |

**Postconditions:**
- Tabs successfully navigated.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-07
**User Flow ID:** UF-ADMIN-07
**Test Case Name:** Admin View Payouts
**Actor:** Super Admin
**Priority:** P1
**Description:** Review campaign payouts.
**Preconditions:**
- User is logged in as Admin and on `/finance/payouts`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Views the Payouts table. | Renders payout rows and supports filtering by statuses (Awaiting release, Processing, Released, Failed, etc.). |

**Postconditions:**
- Payouts can be filtered and exported to CSV.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-08
**User Flow ID:** UF-ADMIN-08
**Test Case Name:** Admin Manage Pledges and Refunds
**Actor:** Super Admin
**Priority:** P1
**Description:** Refund a specific backer's pledge.
**Preconditions:**
- User is logged in as Admin and on `/finance/pledges`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Clicks "Open" on a campaign to view its individual pledges (e.g., `/finance/pledges/<id>`). | The individual pledges ledger is displayed. |
| 2 | Clicks "Refund" on a specific pledge row. | A "Refund this pledge" dialog opens. The "Refund" confirmation button is `[disabled]` initially. |
| 3 | Types a refund reason (min 3 chars). | The "Refund" confirmation button becomes enabled. |

**Postconditions:**
- Admin is able to issue a refund.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-09
**User Flow ID:** UF-ADMIN-09
**Test Case Name:** Admin View Refunds Log
**Actor:** Super Admin
**Priority:** P1
**Description:** View the history of processed refunds.
**Preconditions:**
- User is logged in as Admin and on `/finance/refunds`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Views the Refunds table. | Renders a list of all refunds (Campaign, Amount, Reason, Initiated by). Supports filtering by status. |

**Postconditions:**
- Refund history is visible.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-10
**User Flow ID:** UF-ADMIN-10
**Test Case Name:** Admin User Management
**Actor:** Super Admin
**Priority:** P1
**Description:** Search for users and create new accounts.
**Preconditions:**
- User is logged in as Admin and on `/users`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Searches a user by name or filters by role. | Table dynamically filters user accounts. |
| 2 | Clicks "New user". | The new user form is displayed (Identity, Profile, Billing, Delivery, Notifications, Access Role). |
| 3 | Fills out user details and assigns a staff role, then clicks "Create user". | The user is created and appears in the table. |

**Postconditions:**
- A new user account is active.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-11
**User Flow ID:** UF-ADMIN-11
**Test Case Name:** Admin Manage Roles
**Actor:** Super Admin
**Priority:** P1
**Description:** Check and define staff roles and permissions.
**Preconditions:**
- User is logged in as Admin and on `/roles`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Views the list of system roles (Super Admin, Admin, Project Review Admin, etc.). | |
| 2 | Clicks "New role". | The role creation modal opens, allowing the Admin to define the Role Name, Description, and Access Level (L2-L5). |

**Postconditions:**
- A new custom staff role is defined.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-12
**User Flow ID:** UF-ADMIN-12
**Test Case Name:** Admin Review Deletion Requests
**Actor:** Super Admin
**Priority:** P1
**Description:** Review user account deletion requests.
**Preconditions:**
- User is logged in as Admin and on `/deletion-requests`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Filters the table by status (Pending, Approved, Rejected, etc.). | Table displays matching deletion requests for review. |

**Postconditions:**
- Admin processes account deletions.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-13
**User Flow ID:** UF-ADMIN-13
**Test Case Name:** Admin Manage Contact Inbox
**Actor:** Super Admin
**Priority:** P1
**Description:** Review and update status of contact form submissions.
**Preconditions:**
- User is logged in as Admin and on `/inbox`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Views contact form messages. | Table displays From, Subject, Message, Status, Received Date. |
| 2 | Changes the status of a message using the inline dropdown (e.g. from "new" to "in progress"). | The status is updated instantly. |

**Postconditions:**
- Message status is recorded.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-14
**User Flow ID:** UF-ADMIN-14
**Test Case Name:** Admin View Subscribers
**Actor:** Super Admin
**Priority:** P1
**Description:** View and export newsletter subscribers.
**Preconditions:**
- User is logged in as Admin and on `/subscribers`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Views the subscribers table and tests the "Filter by status" dropdown. | Table displays subscribed users and their source (e.g. footer, settings). |

**Postconditions:**
- Subscribers are visible and can be exported.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-15
**User Flow ID:** UF-ADMIN-15
**Test Case Name:** Admin Manage CMS Pages
**Actor:** Super Admin
**Priority:** P1
**Description:** Create, view, and delete CMS marketing pages.
**Preconditions:**
- User is logged in as Admin and on `/cms`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Views the list of all marketing pages (e.g., Home, About, Creators). | Table renders pages and allows sorting/filtering by status (Draft/Published). |
| 2 | Clicks "New page". | The CMS page editor opens. |
| 3 | Clicks "Delete" on an existing page. | The page is removed. |

**Postconditions:**
- CMS Pages are managed.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-16
**User Flow ID:** UF-ADMIN-16
**Test Case Name:** Admin Configure Global CMS Content
**Actor:** Super Admin
**Priority:** P1
**Description:** Update Navigation and Site Settings.
**Preconditions:**
- User is logged in as Admin and on `/cms/navigation` or `/cms/settings`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | On `/cms/navigation`, reorders navigation links using "Move up" / "Move down" buttons. | Lists are updated dynamically. |
| 2 | On `/cms/settings`, edits platform fee, support email, and footer legal links. | Inputs are saved. |

**Postconditions:**
- Global content structure and variables are updated.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-17
**User Flow ID:** UF-ADMIN-17
**Test Case Name:** Admin View Notifications
**Actor:** Super Admin
**Priority:** P1
**Description:** View and retry system notifications.
**Preconditions:**
- User is logged in as Admin and on `/notifications`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Views the list of all notifications sent by the platform. | Table displays Event, Channel, Status, Provider, Created, and Actions (Retry). |
| 2 | Filters by status (e.g. Failed) and channel (e.g. email). | |

**Postconditions:**
- Admin can audit and retry failed notifications.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes

---

## Test Case ID: FTC-ADMIN-18
**User Flow ID:** UF-ADMIN-18
**Test Case Name:** Admin View Activity Log
**Actor:** Super Admin
**Priority:** P1
**Description:** Audit admin actions across the platform.
**Preconditions:**
- User is logged in as Admin and on `/activity`.
**Test Data:** None

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Views the Activity table. | Renders audit trail of actions (When, Actor, Action, Entity, IP). |

**Postconditions:**
- Platform actions are audited.

**Status:** NEEDS VERIFICATION
**Automation Candidate:** Yes
