# Home Services Quote API

![CI](https://github.com/Mallu848/home-services-api/actions/workflows/ci.yml/badge.svg)

A small REST API that prices exterior cleaning jobs, with automated tests and a CI pipeline. A customer sends a service and a square footage, and the API returns a quote.

## Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/services` | Lists the services offered and their rates |
| POST | `/quotes` | Creates a quote |
| GET | `/quotes/:id` | Returns a saved quote, or 404 if it doesn't exist |

**Example request**

```
POST /quotes
{
  "customerName": "Pat Smith",
  "serviceId": "pressure-washing",
  "squareFeet": 1000
}
```

**Example response (201 Created)**

```
{
  "id": 1,
  "customerName": "Pat Smith",
  "serviceId": "pressure-washing",
  "squareFeet": 1000,
  "total": 300,
  "createdAt": "2026-11-20T21:30:00.000Z"
}
```

Invalid input returns `400` with a list of errors, for example `{ "errors": ["customerName is required"] }`.

## How to run it

```
npm install
npm start
npm test
```

The server listens on port 3000 by default. Set the `PORT` environment variable to change it. Use `npm run test:coverage` to see test coverage.

## How CI works

Every push to `main` and every pull request triggers a GitHub Actions workflow. It installs dependencies with `npm ci`, then runs all tests with a coverage check that fails below 80 percent. The `main` branch is protected, so a pull request can only be merged when the Test check passes. Dependabot opens weekly pull requests for dependency updates, and CI tests them automatically.

## Design decisions

- **App and server split for testability.** `app.js` builds the Express app and `server.js` only starts it, so tests can use Supertest without opening a network port.
- **Validation before business logic.** Routes reject bad input with a `400` before the pricing function runs.
- **Pure pricing logic.** `pricing.js` has no dependencies on Express, so it is easy to unit test.
- **In-memory storage.** Quotes are kept in memory for simplicity, so they reset when the server restarts.

## Testing

17 automated tests cover the pricing logic (unit tests with Jest) and the HTTP routes (integration tests with Jest and Supertest), including edge cases such as invalid square footage, unknown services, and missing request bodies.

## What I would add next

- A database such as PostgreSQL instead of in-memory storage
- Authentication
- Rate limiting
- Automatic deployment to a cloud host after tests pass

## Screenshots

<img width="1901" height="898" alt="Home Services API Blocked Merge" src="https://github.com/user-attachments/assets/fcb2328c-8fe5-437b-af4d-9069a1b391d6" />

<img width="1896" height="868" alt="Home Services API Passed Merge" src="https://github.com/user-attachments/assets/b87e5fa0-8bf5-44a6-89bb-4f2e6712033a" />

