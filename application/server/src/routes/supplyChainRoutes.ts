import { Router, Request, Response, request } from "express";
import { FabricCAClient } from "../services";
import { handleError } from "../errorHandler";
import { HTTP_RESPONSE_CODES } from "../errors";
import { CONTRACT_METHODS } from "../config";

const router = Router();
const fabricCAClient = new FabricCAClient();
fabricCAClient.connect("");

const { STATUS_SUCCESS } = HTTP_RESPONSE_CODES;

router.get("/orders", async (req: Request, res: Response) => {
  try {
    const queryOrderResponse = await fabricCAClient.submitTransaction(
      CONTRACT_METHODS.QUERY_ALL_ORDERS,
      ""
    );
    return res.status(STATUS_SUCCESS).send(queryOrderResponse);
  } catch (error) {
    return handleError(res, error);
  }
});

router.get("/orders/:id", async (req: Request, res: Response) => {
  try {
    const orderID = req.params.id;
    const queryOrderResponse = await fabricCAClient.submitTransaction(
      CONTRACT_METHODS.QUERY_ORDER_ID,
      orderID
    );
    return res.status(STATUS_SUCCESS).send(queryOrderResponse);
  } catch (error) {
    return handleError(res, error);
  }
});

router.post("/orders", async (req: Request, res: Response) => {
  try {
    const createOrderResponse = await fabricCAClient.submitTransaction(
      CONTRACT_METHODS.ORDER_PRODUCT,
      JSON.stringify(request.body)
    );
    console.log(createOrderResponse);
    return res.status(STATUS_SUCCESS).send(createOrderResponse);
  } catch (error) {
    return handleError(res, error, "There was a problem placing the order");
  }
});

router.put("/orders/:id/receive", (req: Request, res: Response) => {
  //
});

router.put("/orders/:id/assign-shipper", (req: Request, res: Response) => {
  //
});

router.put("/orders/:id/create-shipment", (req: Request, res: Response) => {
  //
});

router.put("/orders/:id/transit-shipment", (req: Request, res: Response) => {
  //
});

router.put("/orders/:id/receive-shipment", (req: Request, res: Response) => {
  //
});

router.delete("/orders/:id", (req: Request, res: Response) => {
  //
});

export default router;
