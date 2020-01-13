import { config as dotenvConfig } from "dotenv";

import { CONTRACT_METHODS } from "./methods";

dotenvConfig();

export const config = {
  NODE_ENV: process.env.NODE_ENV,
};

export { CONTRACT_METHODS };
