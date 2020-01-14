import { Router, Request, Response } from "express";
import { FabricCAClient } from "../services";
import { handleError } from "../errorHandler";
import { HTTP_RESPONSE_CODES } from "../errors";

const router = Router();
const fabricCAClient = new FabricCAClient();
fabricCAClient.connect("");

const adminIdentity: any = {};

const { STATUS_SUCCESS } = HTTP_RESPONSE_CODES;

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

    return res.status(STATUS_SUCCESS).json({ message: "enrollmentSuccessful" });
  } catch (error) {
    return handleError(res, error);
  }
});

export default router;
