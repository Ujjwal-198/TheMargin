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
    }
    return globalForMongoose.mongooseConn;
}

export async function disconnectMongoose() {
    if (globalForMongoose.mongooseConn) {
        await globalForMongoose.mongooseConn;
        delete globalForMongoose.mongooseConn;
    }
}