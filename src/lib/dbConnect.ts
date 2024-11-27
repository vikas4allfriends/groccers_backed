// import dotenv from 'dotenv';
// dotenv.config();

import mongoose, { Connection } from "mongoose";
import { DB_NAME } from '../constants';

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("DB Allready connected")
    return
  }

  try {
    let dbURI = process.env.MONGODB_URI + DB_NAME
    const db = await mongoose.connect(dbURI || '', {});
    connection.isConnected = db.connections[0].readyState;
    console.log('Database connected successfully', db.connections[0].readyState);

  } catch (error) {
    console.error('Database connection failed:', error);
    // Graceful exit in case of a connection error
    process.exit(1);

  }
}

export default dbConnect;