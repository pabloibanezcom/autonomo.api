/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

type TInput = {
  db: string;
};
export default async ({ db }: TInput): Promise<void> => {
  const connect = async () => {
    console.log(`Connecting to: ${db} ...`);
    mongoose
      .connect(db)
      .then(() => {
        return console.info(`Successfully connected to ${db}`);
      })
      .catch(error => {
        console.error('Error connecting to database: ', error);
        return process.exit(1);
      });
  };
  await connect();

  mongoose.connection.on('disconnected', connect);
};
