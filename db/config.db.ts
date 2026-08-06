import {
  MongoClient,
  Db,
  type MongoClientOptions,
  ServerApiVersion,
} from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI env variable is not defined");
}
if (!dbName) {
  throw new Error("MONGODB_DB_NAME env variable is not defined");
}

class Database {
  private client: MongoClient;
  private database: Db | null = null;

  private readonly options: MongoClientOptions = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 20,
    minPoolSize: 5,
    maxIdleTimeMS: 30_000,
    serverSelectionTimeoutMS: 5_000,
    socketTimeoutMS: 45_000,
    retryWrites: true,
    retryReads: true,
  };

  constructor() {
    this.client = new MongoClient(uri!, this.options);
  }

  async connect(): Promise<void> {
    if (this.database) {
      return;
    }

    await this.client.connect();
    this.database = this.client.db(dbName);

    await this.database.command({ ping: 1 });

    console.log("MongoDB connected");
  }

  db(): Db {
    if (!this.database) {
      throw new Error("Database has not been connected.");
    }

    return this.database;
  }

  async close(): Promise<void> {
    await this.client.close();
    this.database = null;
  }
}

export const database = new Database();
