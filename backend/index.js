import express from "express";
import mongoose from "mongoose";
import { mongoDBURL } from "./config.js";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://mern-deployement-frontend.vercel.app/",
    credentials: true,
  })
);


mongoose.connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");

    app.listen(4000, () => {
      console.log(`App is listening to port: 4000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
