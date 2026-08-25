# Functional Test Cases

---

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

## Test Case ID: FTC-BACK-01
**User Flow ID:** UF-BACK-01
**Test Case Name:** Campaign Pledge Checkout Validation & Success
**Actor:** Authenticated Backer
**Priority:** P0
**Description:** Verify that a logged-in user can back a campaign, is blocked if mandatory fields (Terms of Use/Address) are omitted, and successfully completes the pledge when corrected.
**Preconditions:**
- The application environment is running.
- The user is authenticated.
- A live campaign exists and is accepting pledges.
**Test Data:**
- Valid shipping address details.

**Test Steps:**

| Step | User Action | Expected UI/Application Result |
|------|-------------|--------------------------------|
| 1 | Navigate to a specific live campaign page (e.g., `/campaign/solar`). | The campaign detail page loads successfully. |
| 2 | Click the "Back This Project" button. | The UI redirects the user to the reward selection step (`/campaign/[id]/back`). |
| 3 | Select a specific reward tier and click "Continue". | The UI progresses to the payment and shipping address form. |
| 4 | Attempt to click "Complete Pledge" without filling in the shipping address or checking the "Terms of Use" checkbox. | Client-side validation prevents submission. The UI highlights the missing mandatory fields and/or disables the submit button. |
| 5 | Fill out the required shipping address fields and check the "Terms of Use" box, then click "Complete Pledge". | The UI processes the submission and redirects the user to a success confirmation screen displaying "You're a Backer!". |
| 6 | Navigate back to the Dashboard. | The newly backed campaign appears in the user's "Backed Projects" list (Needs Verification: Depends on Dashboard implementation). |

**Postconditions:**
- The pledge is successfully recorded.
- The user is confirmed as a backer of the campaign.

**Status:** PASS (Steps 1-5 verified). Step 6 NEEDS VERIFICATION.
**Automation Candidate:** Yes
