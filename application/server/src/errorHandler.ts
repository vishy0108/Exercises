import { Response } from "express";
import { ValidationError, HTTP_RESPONSE_CODES } from "./errors";

import { config } from "./config";

export const handleError = (res: Response, error: Error, message?: string) => {
  if (config.NODE_ENV === "development") {
    console.log(error);
  }

  let errorMessage = null;
  let errorCode;

  if (error instanceof ValidationError) {
    errorCode = HTTP_RESPONSE_CODES.CLIENT_ERROR;
    errorMessage = error.message ? error.message : message;
  } else {
    errorCode = HTTP_RESPONSE_CODES.SERVER_ERROR;
    errorMessage = message ? message : "Unknown error occurred";
  }

  return res.status(errorCode).send(errorMessage);
};
