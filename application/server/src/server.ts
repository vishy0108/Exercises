import express, { Express } from "express";
import { config } from "./config";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // allow cross origin requests
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const { PORT } = config;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Failed to start server");
  }
  console.log(`Server started on port ${PORT}`);
});
