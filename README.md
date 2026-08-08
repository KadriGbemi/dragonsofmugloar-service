# Dragons of Mugloar Service

An API service for the [Dragons of Mugloar](https://dragonsofmugloar.com/doc/) game API, built with Express and TypeScript.

The service provides a backend API for managing game sessions, game history, advertisements, reputation investigations, and shop interactions while persisting game data in MongoDB.

## Requirements

This project runs TypeScript files directly with Node.js using Node's native TypeScript support.

| Tool | Minimum version | Version used in this project |
| --- | --- | --- |
| Node.js | >= 22.18.0 (or >= 23.6.0 on the v23 line) | v24.19.0 |
| TypeScript | >= 5.8 | 7.0.2 |
| MongoDB | MongoDB instance required | MongoDB Atlas or local MongoDB |

> **Important**
>
> Node strips TypeScript types when running `.ts` files natively, but it does not type-check them. Always run `npx tsc` separately to type-check the project before relying on it.
>
> For more information, see the [Node.js guide on running TypeScript natively](https://nodejs.org/learn/typescript/run-natively).

### Checking your versions

```bash
node --version
# should print v22.18.0 or higher

npx tsc -v
# should print Version 5.8.0 or higher
```

If either version is lower than required, `node src/app.ts` will fail, or `node --watch` will not behave as expected (see the note below).

## Installation

```bash
git clone https://github.com/KadriGbemi/dragonsofmugloar-service.git
cd dragonsofmugloar-service
npm install
```

## Environment variables
The application loads environment variables from .env using Node's built-in --env-file=.env support.

Create a .env file in the project root:

```bash
touch .env
```
Add the following variables:

```bash
DRAGONS_API_URL=''

MONGODB_URI=''

MONGODB_DB_NAME=''

NODE_ENV="development"

FRONTEND_URL='http://localhost:5173'
```
## Running the project

### Start (no file watching)

```bash
npm start
```

This runs:

```bash
node --env-file=.env src/app.ts
```

### Development mode (with file watching)

```bash
npm run dev
```

This runs:

```json
node --watch --env-file=.env src/app.ts
```

> **Note on `node --watch`**
> The `--watch` flag only restarts the process on file changes on Node versions that support it alongside native TypeScript execution, meaning Node.js >= 22.18.0 (or >= 23.6.0 on the v23 line). On older Node versions, either `--watch` is unavailable, or native `.ts` execution itself will fail before `--watch` becomes relevant. Confirm your Node version first with `node --version` if `npm run dev` does not behave as expected.

## Type checking

Since Node does not type-check `.ts` files when running them natively, run the TypeScript compiler on its own to catch type errors:

```bash
npx tsc
```

Treat this as a required step before committing changes or deploying, since `npm start` and `npm run dev` will not warn about type errors on their own.

## Type checking
The project uses Vitest for testing.

Run tests in watch mode:

```bash
npm test
```
Run tests once:
```bash
npm run test:run
```
Run tests with coverage:
```bash
npm run test:coverage
```
## API documentation

The project uses swagger-autogen and swagger-ui-express to generate and serve API documentation.

The Swagger specification is generated into:

```bash
swagger-output.json
```
Once the application is running, Swagger UI is available at:

```bash
http://localhost:3000/
```

## API Endpoints

The backend runs on port 3000 by default.

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| `POST` | `/game/start/:playerName` | Start a new game for a player |
| `GET`  | `/game/:gameId`           | Get a game by game ID         |
| `GET`  | `/game/history/:playerId` | Get a player's game history   |


## Reputation

| Method | Endpoint                          | Description                           |
| ------ | --------------------------------- | ------------------------------------- |
| `POST` | `/reputation/:gameId/investigate` | Investigate the reputation for a game |

## Advertisements

| Method | Endpoint                   | Description                            |
| ------ | -------------------------- | -------------------------------------- |
| `GET`  | `/ads/:gameId/messages`    | Get advertisements/messages for a game |
| `POST` | `/ads/:gameId/solve/:adId` | Solve an advertisement                 |

## Shop

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| `GET`  | `/shop/list/:gameId`        | Get available shop items |
| `POST` | `/shop/:gameId/buy/:itemId` | Purchase a shop item     |


## Project structure

```
.
├── clients/dragonsofmugloar   # Client for the Dragons of Mugloar game API
├── controllers                # Request handlers
├── db                         # MongoDB connection and indexes
├── middleware                 # Express middleware and game guards
├── routes                     # Express route definitions
├── schemas                    # Request validation schemas
├── services                   # Business logic / service layer
├── src                        # Application entry point
├── types                      # Shared TypeScript types
├── swagger.config.ts          # Swagger configuration
├── swagger-output.json        # Generated Swagger/OpenAPI specification
├── tsconfig.json
└── package.json
```

## Available Scripts

| Script                  | Command                                   | Purpose                       |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| `npm start`             | `node --env-file=.env src/app.ts`         | Run the app once              |
| `npm run dev`           | `node --watch --env-file=.env src/app.ts` | Run the app with auto-restart |
| `npm test`              | `vitest`                                  | Run tests in watch mode       |
| `npm run test:run`      | `vitest run`                              | Run tests once                |
| `npm run test:coverage` | `vitest run --coverage`                   | Run tests with coverage       |
| `npm run format`        | `prettier --write .`                      | Format the codebase           |
| `npx tsc`               | —                                         | Type-check the project        |


## Security

The service includes several security and production-oriented protections:
- Helmet security headers
- HTTP parameter pollution protection
- CORS configuration
- API rate limiting
- Request payload size limits
- Request validation with Zod
- MongoDB connection pooling
- MongoDB retry configuration
- Graceful HTTP server shutdown
- Graceful MongoDB connection shutdown

## Production Checklist
Before deploying:
- Set NODE_ENV=production.
- Set FRONTEND_URL to the exact deployed frontend URL.
- Set a secure MONGODB_URI.
- Set the correct MONGODB_DB_NAME.
- Set the production DRAGONS_API_URL.
- Never commit .env or database credentials.
- Run npx tsc to verify TypeScript.
- Run npm run test:run to verify the test suite.
- Make sure the server can connect to MongoDB and the Dragons of Mugloar API.

## License

MIT
