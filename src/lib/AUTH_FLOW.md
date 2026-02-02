# Authentication Flow - VideoGenerator

## Overview

VideoGenerator uses JWT-based authentication with refresh tokens. The flow supports:
- Email/password authentication
- Token refresh mechanism
- Protected routes
- Persistent sessions

---

## Authentication State Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION STATES                          │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   UNKNOWN    │  App loads, checking for existing session
    └──────┬───────┘
           │
           │ Check for stored tokens
           ↓
    ┌──────────────┐
    │  ANONYMOUS   │  No valid session, user not logged in
    └──────┬───────┘  Show: Login/Signup buttons
           │
    ┌──────┴───────┐     ┌──────────────────┐
    │              ↓     ↓                  │
    │    ┌─────────────────┐                │
    │    │  AUTH MODAL     │  User clicks Login/Signup
    │    │  (Overlay)      │                │
    │    └────────┬────────┘                │
    │             │                         │
    │    ┌────────┴────────┐                │
    │    ↓                 ↓                │
    │  LOGIN FLOW    SIGNUP FLOW           │
    │    │                 │                │
    │    └────────┬────────┘                │
    │             ↓                         │
    │    ┌──────────────┐                   │
    │    │  AUTHENTICATED│  Valid tokens received
    │    └──────┬───────┘                   │
    │           │                           │
    │    ┌──────┴──────┐                    │
    │    ↓             ↓                    │
    │  Dashboard   Index Page               │
    │    │             │                    │
    │    └──────┬──────┘                    │
    │           ↓                           │
    │    ┌──────────────┐                   │
    │    │  LOGOUT      │  User clicks Logout
    │    └──────┬───────┘                   │
    │           ↓                           │
    └───────────┴───────────────────────────┘
                 ↓
         ┌──────────────┐
         │   ANONYMOUS   │  Back to unauthenticated state
         └──────────────┘
```

---

## Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Log In" button
   │
   ↓
2. AuthModalContainer opens (login mode)
   │
   ↓
3. User enters email + password
   │
   ↓
4. User clicks "Log In" submit
   │
   ↓
5. API call: POST /api/v1/auth/login
   │
   │ Headers: Content-Type: application/json
   │ Body: { email, password }
   │
   ↓
6. Server validates credentials
   │
   ├─ Invalid credentials → Return 401
   │  │
   │  ↓
   │  Show error message "Invalid email or password"
   │
   └─ Valid credentials → Generate JWT tokens
      │
      ↓
7. API Response (200 OK)
   │
   │ {
   │   "success": true,
   │   "data": {
   │     "user": { id, email, displayName, ... },
   │     "tokens": {
   │       "accessToken": "eyJ...",
   │       "refreshToken": "eyJ...",
   │       "expiresAt": 1738454400000
   │     }
   │   }
   │ }
   │
   ↓
8. Store tokens securely
   │
   ├─ accessToken → httpOnly cookie (or memory)
   ├─ refreshToken → httpOnly cookie
   └─ user → React Query cache
   │
   ↓
9. Update AuthContext state
   │
   │ isAuthenticated: true
   │ user: User object
   │
   ↓
10. Close auth modal
    │
    ↓
11. Navigate to Dashboard
    │
    ↓
12. Show success notification "Welcome back!"
```

---

## Signup Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        SIGNUP FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Sign Up" button
   │
   ↓
2. AuthModalContainer opens (signup mode)
   │
   ↓
3. User enters email + password + display name
   │
   ↓
4. User clicks "Create Account"
   │
   ↓
5. API call: POST /api/v1/auth/register
   │
   │ Headers: Content-Type: application/json
   │ Body: { email, password, displayName }
   │
   ↓
6. Server validates input
   │
   ├─ Validation error (missing fields) → Return 400
   │  │
   │  ↓
   │  Show field-specific errors
   │
   ├─ Email already exists → Return 409
   │  │
   │  ↓
   │  Show "Email already registered"
   │
   └─ Valid input → Create user account
      │
      ↓
7. API Response (201 Created)
   │
   │ {
   │   "success": true,
   │   "data": {
   │     "user": { id, email, displayName, ... },
   │     "tokens": { ... }
   │   }
   │ }
   │
   ↓
8. Store tokens + update state (same as login)
   │
   ↓
9. Close modal, navigate to Dashboard
   │
   ↓
10. Show welcome notification + onboarding tip
```

---

## Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     TOKEN REFRESH FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. App makes API request with accessToken
   │
   ↓
2. Server validates token
   │
   ├─ Valid → Process request, return data
   │
   └─ Expired (401) → Return error with code "AUTH_EXPIRED"
      │
      ↓
3. Client detects "AUTH_EXPIRED" error
   │
   ↓
4. Check if refreshToken exists
   │
   ├─ No refreshToken → Force logout
   │  │
   │  ↓
   │  Clear all state
   │  Show "Session expired, please login again"
   │  Open auth modal
   │
   └─ Has refreshToken → Attempt refresh
      │
      ↓
5. API call: POST /api/v1/auth/refresh
   │
   │ Headers: Authorization: Bearer {accessToken} (expired)
   │ Body: { refreshToken }
   │
   ↓
6. Server validates refreshToken
   │
   ├─ Invalid/expired refreshToken → Return 401
   │  │
   │  ↓
   │  Force logout (same as above)
   │
   └─ Valid refreshToken → Generate new tokens
      │
      ↓
7. API Response (200 OK)
   │
   │ {
   │   "success": true,
   │   "data": {
   │     "accessToken": "new...",
   │     "expiresAt": 1738458000000
   │   }
   │ }
   │
   ↓
8. Update stored tokens
   │
   ↓
9. Retry original API request with new accessToken
   │
   ↓
10. Success! Return data to user
```

---

## Protected Route Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROTECTED ROUTE FLOW                         │
└─────────────────────────────────────────────────────────────────┘

User attempts to access /dashboard
    │
    ↓
Check AuthContext.isAuthenticated
    │
    ├─ true → Render protected page
    │
    └─ false → Check for stored tokens
        │
        ├─ Has tokens → Validate with /auth/me
        │  │
        │  ├─ Valid → Set auth state, render page
        │  │
        │  └─ Invalid → Redirect to /, open auth modal
        │
        └─ No tokens → Redirect to /, open auth modal
            │
            ↓
Show Index page with auth modal visible
```

---

## Logout Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOGOUT FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Log Out" button
   │
   ↓
2. API call: POST /api/v1/auth/logout
   │
   │ Headers: Authorization: Bearer {accessToken}
   │
   ↓
3. Server invalidates refresh token
   │
   ↓
4. Clear client-side state
   │
   ├─ Remove tokens from cookies/localStorage
   ├─ Clear React Query cache
   ├─ Reset AuthContext.user to null
   └─ Clear any local storage
   │
   ↓
5. Navigate to Index page
   │
   ↓
6. Show "Logged out successfully"
```

---

## API Error Handling

```
┌─────────────────────────────────────────────────────────────────┐
│                     API ERROR HANDLING                          │
└─────────────────────────────────────────────────────────────────┘

API Response
    │
    ├─ 200 OK → Return data
    │
    ├─ 400 Bad Request → Show validation errors
    │  │  { "error": { "code": "VALIDATION_ERROR", "details": {...} } }
    │  │
    │  └─ Display field-level errors under each input
    │
    ├─ 401 Unauthorized → Handle based on error code
    │  │
    │  ├─ "AUTH_INVALID" → Show "Invalid credentials"
    │  │
    │  ├─ "AUTH_EXPIRED" → Trigger token refresh
    │  │
    │  └─ "AUTH_REQUIRED" → Redirect to login
    │
    ├─ 403 Forbidden → Handle based on error
    │  │
    │  └─ "VIDEO_LIMIT_EXCEEDED" → Show upgrade prompt
    │
    ├─ 404 Not Found → Show "Resource not found"
    │
    ├─ 409 Conflict → Show conflict message (e.g., "Email exists")
    │
    └─ 500+ Server Error → Show generic error, offer retry
```

---

## Token Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        JWT STRUCTURE                            │
└─────────────────────────────────────────────────────────────────┘

Access Token (short-lived: 15 minutes)
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1738452600,
  "exp": 1738453500,
  "type": "access"
}

Refresh Token (long-lived: 7 days)
{
  "sub": "user_id",
  "iat": 1738452600,
  "exp": 1739057400,
  "type": "refresh"
}
```

---

## Security Considerations

| Concern | Implementation |
|---------|----------------|
| Token storage | httpOnly cookies (prevents XSS access) |
| CSRF protection | Double-submit cookie pattern |
| Token expiration | Short-lived access (15min), longer refresh (7d) |
| Secure transport | HTTPS only, SameSite=Strict |
| Password hashing | bcrypt with salt rounds |
| Rate limiting | 5 login attempts per minute |
| Account lockout | After 10 failed attempts (15 min) |
