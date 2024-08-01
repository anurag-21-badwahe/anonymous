import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    // console.log('Already connected to the database');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {}); // {} this is for extra option


    connection.isConnected = db.connections[0].readyState; // define the current state of MongoDB connection

    // console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);  // exit in case of a connection error
  }
};

export default dbConnect;
