# Dragons of Mugloar Service

An API service for the [Dragons of Mugloar](https://dragonsofmugloar.com/doc/) game API, built on Express.

## Requirements

This project runs TypeScript files directly with Node.js, using Node's native TypeScript support. Because of this, the environment must meet the following minimum versions:

| Tool       | Minimum version                           | Version used in this project |
| ---------- | ----------------------------------------- | ---------------------------- |
| Node.js    | >= 22.18.0 (or >= 23.6.0 on the v23 line) | v24.19.0                     |
| TypeScript | >= 5.8                                    | 7.0.2                        |

> **Important**
> Node strips TypeScript types when running `.ts` files natively, but it does not type-check them. This means the app will start and run even if there are type errors in the code. Always run `npx tsc` separately to type-check the project before relying on it.
>
> For background on how this works, see the Node.js guide on [running TypeScript natively](https://nodejs.org/learn/typescript/run-natively).

### Checking your versions

```bash
node --version
# should print v22.18.0 or higher (or v23.6.0+ on the v23 line)

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

The app is started with `--env-file=.env`, so create a `.env` file in the project root before running it:

```bash
touch .env
```

Add any required variables to this file (check `src/app.ts` and the `services` folder for what the app expects, such as the Mugloar API base URL or auth-related values).

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

## API documentation

The project uses `swagger-autogen` and `swagger-ui-express` to generate and serve API documentation from `swagger.config.ts`, with output written to `swagger-output.json`. Once the server is running, check the Express route configuration in the `routes` folder for the exact path the Swagger UI is served on (commonly `/api-docs` or similar).

## Project structure

```
.
├── clients/dragonsofmugloar   # Client for the Dragons of Mugloar game API
├── controllers                # Request handlers
├── routes                     # Express route definitions
├── services                   # Business logic / service layer
├── src                        # App entry point (app.ts)
├── types                      # Shared TypeScript types
├── swagger.config.ts          # Swagger generation config
├── swagger-output.json        # Generated Swagger/OpenAPI spec
├── tsconfig.json
└── package.json
```

## Scripts reference

| Script           | Command                                   | Purpose                                       |
| ---------------- | ----------------------------------------- | --------------------------------------------- |
| `npm start`      | `node --env-file=.env src/app.ts`         | Run the app once, no restart on file changes  |
| `npm run dev`    | `node --watch --env-file=.env src/app.ts` | Run the app with auto-restart on file changes |
| `npm run format` | `prettier --write .`                      | Format the codebase with Prettier             |
| `npx tsc`        | —                                         | Type-check the project (does not run the app) |

## License

MIT
