# API Route Map - VideoGenerator

## Base URL
```
Production: https://api.videogenerator.app/v1
Development: http://localhost:3000/api/v1
```

## Authentication Endpoints

### POST /api/v1/auth/register
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "displayName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "displayName": "..." },
    "tokens": { "accessToken": "...", "refreshToken": "...", "expiresAt": 1234567890 }
  }
}
```

### POST /api/v1/auth/login
Authenticate user and return tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "displayName": "..." },
    "tokens": { "accessToken": "...", "refreshToken": "...", "expiresAt": 1234567890 }
  }
}
```

### POST /api/v1/auth/logout
Invalidate refresh token.

**Headers:** Authorization: Bearer {accessToken}

**Response (200):**
```json
{ "success": true }
```

### POST /api/v1/auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "expiresAt": 1234567890
  }
}
```

### GET /api/v1/auth/me
Get current user profile.

**Headers:** Authorization: Bearer {accessToken}

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "preferences": { ... }
  }
}
```

---

## Video Endpoints

### GET /api/v1/videos
List videos with pagination and filters.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `status` (queued | processing | completed | failed)
- `styleId` (string)
- `aspectRatio` (16:9 | 9:16 | 1:1)
- `search` (string)
- `sortBy` (createdAt | title | status)
- `sortOrder` (asc | desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "...",
        "status": "completed",
        "styleId": "...",
        "aspectRatio": "16:9",
        "duration": 30,
        "createdAt": "2026-02-02T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 128,
      "totalPages": 7
    }
  }
}
```

### POST /api/v1/videos
Create a new video generation job.

**Headers:** Authorization: Bearer {accessToken}

**Request:**
```json
{
  "title": "Product Launch Reel",
  "prompt": "Create an engaging product launch video...",
  "styleId": "clean-motion",
  "aspectRatio": "16:9",
  "duration": 30,
  "templateId": "uuid" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Product Launch Reel",
    "status": "queued",
    "createdAt": "2026-02-02T10:00:00Z"
  }
}
```

### GET /api/v1/videos/:id
Get video details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "...",
    "prompt": "...",
    "styleId": "...",
    "aspectRatio": "16:9",
    "duration": 30,
    "status": "completed",
    "fileUrl": "https://...",
    "thumbnailUrl": "https://...",
    "metadata": {
      "resolution": "1920x1080",
      "fileSize": 5242880,
      "format": "mp4"
    },
    "createdAt": "2026-02-02T10:00:00Z",
    "updatedAt": "2026-02-02T10:05:00Z"
  }
}
```

### PATCH /api/v1/videos/:id
Update video (e.g., title).

**Request:**
```json
{
  "title": "Updated Title"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { "id": "uuid", "title": "Updated Title" }
}
```

### DELETE /api/v1/videos/:id
Delete a video.

**Response (200):**
```json
{ "success": true }
```

### GET /api/v1/videos/:id/progress
Get video generation progress (for polling).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "processing",
    "progress": 65,
    "message": "Rendering frames..."
  }
}
```

### GET /api/v1/videos/:id/download
Get signed download URL.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://.../video.mp4?signature=...",
    "expiresAt": "2026-02-02T11:00:00Z"
  }
}
```

---

## Template Endpoints

### GET /api/v1/templates
List user's templates.

**Query Parameters:**
- `page`, `limit`
- `search`
- `style`
- `sortBy`, `sortOrder`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": { ... }
  }
}
```

### POST /api/v1/templates
Create a new template.

**Headers:** Authorization: Bearer {accessToken}

**Request:**
```json
{
  "title": "Weekly Update",
  "basePrompt": "Create a weekly update about {topic}...",
  "defaultStyle": "clean-motion",
  "defaultAspectRatio": "16:9",
  "defaultDuration": 60,
  "variables": [
    { "name": "topic", "placeholder": "{topic}", "description": "Main topic", "required": true }
  ],
  "isPublic": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { "id": "uuid", "title": "Weekly Update", ... }
}
```

### GET /api/v1/templates/:id
Get template details.

### PATCH /api/v1/templates/:id
Update template.

### DELETE /api/v1/templates/:id
Delete template.

### POST /api/v1/templates/:id/duplicate
Duplicate a template.

---

## Usage Endpoints

### GET /api/v1/usage/stats
Get usage statistics for current user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalVideos": 128,
    "queuedVideos": 6,
    "processingVideos": 4,
    "completedVideos": 102,
    "failedVideos": 16,
    "videosThisWeek": 23,
    "videosThisMonth": 87,
    "videosWithFiles": 94,
    "styleBreakdown": { "explainer": 42, "social": 38, ... },
    "aspectBreakdown": { "16:9": 68, "9:16": 45, "1:1": 15 }
  }
}
```

### GET /api/v1/usage/history
Get usage history with pagination.

---

## User Endpoints

### GET /api/v1/users/me
Get current user profile (same as /auth/me).

### PATCH /api/v1/users/me
Update user profile.

**Request:**
```json
{
  "displayName": "New Name",
  "preferences": {
    "defaultStyle": "clean-motion",
    "defaultAspectRatio": "16:9",
    "defaultDuration": 30,
    "notifications": {
      "emailOnComplete": true,
      "emailOnFail": true,
      "marketingEmails": false
    }
  }
}
```

### POST /api/v1/users/me/password
Change password.

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword"
}
```

### DELETE /api/v1/users/me
Delete account (requires confirmation).

---

## Style Endpoints (Public)

### GET /api/v1/styles
List available video styles.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clean-motion",
      "name": "Clean Motion",
      "description": "Professional motion graphics",
      "category": "motion",
      "colorToken": "#6366f1",
      "availableDurations": [15, 30, 60, 120]
    }
  ]
}
```

---

## Webhook Endpoints

### POST /api/webhooks/video-status
Receive video status updates from video generation service.

**Headers:** X-Webhook-Signature

**Request:**
```json
{
  "videoId": "uuid",
  "status": "completed",
  "fileUrl": "https://...",
  "errorMessage": null
}
```

---

## Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| POST /videos | 10/minute |
| GET /videos | 100/minute |
| POST /templates | 20/minute |
| POST /auth/* | 5/minute |

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| AUTH_INVALID | 401 | Invalid credentials |
| AUTH_EXPIRED | 401 | Token expired |
| AUTH_REQUIRED | 401 | Authentication required |
| VIDEO_NOT_FOUND | 404 | Video not found |
| VIDEO_LIMIT_EXCEEDED | 403 | Monthly video limit reached |
| TEMPLATE_NOT_FOUND | 404 | Template not found |
| VALIDATION_ERROR | 400 | Invalid input |
| INTERNAL_ERROR | 500 | Server error |
