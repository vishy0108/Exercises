import { config as dotenvConfig } from "dotenv";

import { CONTRACT_METHODS } from "./methods";

dotenvConfig();

export const config = {
  NODE_ENV: process.env.NODE_ENV || "production",
  PORT: Number(process.env.PORT || "5000"),
};

export { CONTRACT_METHODS };
