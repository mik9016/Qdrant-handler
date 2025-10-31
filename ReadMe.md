# Qdrant Handler Server

This is a Node.js Express server that provides a simple API for managing resources in Qdrant collections.

## Summary

- Loads environment variables from `.env`
- Requires `API_KEY` and `QDRANT_URL` to be set in the environment
- Secures all endpoints with Bearer token authentication
- Provides endpoints to delete all points in a Qdrant collection and to check server status

## Endpoints

### `GET /`

- **Description:** Health check endpoint.
- **Auth:** Requires `Authorization: Bearer <API_KEY>` header.
- **Response:** `{ "status": "ok" }`

### `DELETE /resource/:collection`

- **Description:** Deletes all points in the specified Qdrant collection.
- **Auth:** Requires `Authorization: Bearer <API_KEY>` header.
- **Params:** 
  - `collection` (string): Name of the Qdrant collection.
- **Response:** 
  - Success: `{ "success": true, "deleted": <number_of_deleted_points> }`
  - Error: `{ "error": <error_message> }`

## Usage

1. Set up a `.env` file with:
   ```
   API_KEY=your_api_key
   QDRANT_URL=http://your-qdrant-url
   PORT=3000
   ```
2. Install dependencies: `npm install`
3. Start the server: `node server.js`

