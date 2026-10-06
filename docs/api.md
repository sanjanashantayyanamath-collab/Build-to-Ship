# API Documentation

All API endpoints are prefixed with `/api`. All endpoints except `/api/health` require an `Authorization: Bearer <access_token>` header containing a valid Supabase Auth JWT.

## Health Check
- **`GET /api/health`**
  - **Auth**: None
  - **Response**: `{ "status": "ok", "timestamp": "...", "environment": "development" }`

## Advisories Endpoints

- **`POST /api/advisories`**
  - **Auth**: Required (`Bearer <token>`)
  - **Body**:
    ```json
    {
      "crop": "Tomato",
      "location": "Mysuru, Karnataka",
      "soilType": "Red",
      "season": "Kharif",
      "growthStage": "Flowering",
      "irrigation": "Available",
      "irrigationMethod": "Drip",
      "temperatureC": 28.5,
      "rainfallMm": 120.0,
      "farmSizeAcres": 2.5,
      "problem": "Yellowing leaves with dark brown spots on lower canopy after light rain.",
      "language": "English"
    }
    ```
  - **Response (201 Created)**: Returns advisory object including structured `aiResponse`.

- **`GET /api/advisories`**
  - **Auth**: Required
  - **Query Params**: `page` (default 1), `pageSize` (default 10), `crop`, `risk`, `q`
  - **Response (200 OK)**: `{ "items": [...], "page": 1, "pageSize": 10, "total": 15 }`

- **`GET /api/advisories/stats`**
  - **Auth**: Required
  - **Response (200 OK)**: `{ "totalAdvisories": 15, "riskCounts": { "low": 5, "medium": 8, "high": 2 }, "mostQueriedCrop": "Tomato", "recentAdvisories": [...] }`

- **`GET /api/advisories/:id`**
  - **Auth**: Required
  - **Response (200 OK)**: Single advisory details object.

- **`DELETE /api/advisories/:id`**
  - **Auth**: Required
  - **Response (200 OK)**: `{ "success": true, "message": "Advisory deleted successfully" }`

## Profile Endpoints

- **`GET /api/profile`**
  - **Auth**: Required
  - **Response (200 OK)**: Profile details for the authenticated user.

- **`PUT /api/profile`**
  - **Auth**: Required
  - **Body**: `{ "name": "Farmer Name", "defaultLocation": "Location Name", "preferredLanguage": "English" }`
  - **Response (200 OK)**: Updated profile object.
