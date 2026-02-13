import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;

if (!uri) {
    throw new Error("Please add MONGODB_URI to .env.local");
}

type MongooseGlobal = typeof globalThis & {
    mongooseConn?: Promise<typeof mongoose>;
};

const globalForMongoose = globalThis as MongooseGlobal;

export async function connectMongoose() {
    if (!globalForMongoose.mongooseConn) {
        globalForMongoose.mongooseConn = mongoose.connect(uri, {
            bufferCommands: false,
        });
        
        try {
            await globalForMongoose.mongooseConn;
            console.log("✅ MongoDB connected successfully");
            
            // Ensure models are registered after connection
            // Import models to register them with Mongoose
            await import("./user/user.model");
            await import("./blog/blog.model");
        } catch (error) {
            console.error("❌ MongoDB connection failed:", error instanceof Error ? error.message : error);
            delete globalForMongoose.mongooseConn;
            throw error;
        }
    }
    return globalForMongoose.mongooseConn;
}

export async function disconnectMongoose() {
    if (globalForMongoose.mongooseConn) {
        await globalForMongoose.mongooseConn;
        delete globalForMongoose.mongooseConn;
    }
}