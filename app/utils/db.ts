import mongoose from "mongoose";
import dns from "dns";

// Programmatically use Google DNS to bypass local ISP SRV resolution blockages
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.warn("Could not set custom DNS servers programmatically:", error);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}
const cached = globalWithMongoose.mongoose;

// Register connection status listeners
if (mongoose.connection.listeners("connected").length === 0) {
  mongoose.connection.on("connected", () => {
    console.log("🟢 MongoDB connection status: CONNECTED successfully!");
  });
}

if (mongoose.connection.listeners("error").length === 0) {
  mongoose.connection.on("error", (err) => {
    console.error("🔴 MongoDB connection status: CONNECTION ERROR!");
    console.error(`Error details: ${err.message}`);
  });
}

if (mongoose.connection.listeners("disconnected").length === 0) {
  mongoose.connection.on("disconnected", () => {
    console.log("🟡 MongoDB connection status: DISCONNECTED.");
  });
}

export function logConnectionStatus(): string {
  const states = {
    0: "🔴 Disconnected",
    1: "🟢 Connected",
    2: "🟡 Connecting",
    3: "🟠 Disconnecting"
  };
  const stateNum = mongoose.connection.readyState as 0 | 1 | 2 | 3;
  const status = states[stateNum] || "Unknown state";
  console.log(`[Database Status Check] Current Mongoose Connection State: ${status}`);
  return status;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri!, opts).then((m) => {
      console.log("Connected to MongoDB via Mongoose successfully.");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Re-export fallback function for legacy raw MongoDB driver support if needed
export async function getDb() {
  await connectDB();
  return mongoose.connection.db;
}


