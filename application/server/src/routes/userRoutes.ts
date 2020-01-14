import { Router, Request, Response, Application } from "express";
import { FabricCAClient } from "../services";
import { handleError } from "../errorHandler";
import { HTTP_RESPONSE_CODES } from "../errors";

const adminIdentity: any = {};

const { STATUS_SUCCESS } = HTTP_RESPONSE_CODES;

export const userRouter = (app: Application) => {
  const router = Router();
  const fabricCAClient = app.get("fabric-ca-client");

  router.post("/register", async (req: Request, res: Response) => {
    try {
      const { userName, password, userType } = req.body;
      const secret = await fabricCAClient.registerUser(
        userName,
        password,
        userType,
        adminIdentity
      );

      return res.status(STATUS_SUCCESS).json(secret);
    } catch (error) {
      return handleError(res, error);
    }
  });

  router.post("/enroll", async (req: Request, res: Response) => {
    try {
      const { userName, password, userType } = req.body;
      await fabricCAClient.enrollUser(userName, password, userType);

      return res
        .status(STATUS_SUCCESS)
        .json({ message: "enrollmentSuccessful" });
    } catch (error) {
      return handleError(res, error);
    }
  });
};
